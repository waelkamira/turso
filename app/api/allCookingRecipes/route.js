import prisma from '../../../lib/PrismaClient';

export async function GET(req) {
  try {
    // Parse query parameters for pagination and filtering
    const url = new URL(req.url);
    const searchParams = url.searchParams;
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const selectedValue = searchParams.get('selectedValue');
    const id = searchParams.get('id'); // Keep as string
    const skip = (page - 1) * limit;

    // Build the query object
    const query = {};
    if (selectedValue) {
      query.selectedValue = selectedValue;
    }

    // Fetch the meal from the database
    let meals;
    if (id) {
      meals = await prisma.meal?.findUnique({
        where: { id }, // Convert to number for the database
      });
    } else {
      meals = await prisma.meal?.findMany({
        where: Object.keys(query).length ? query : undefined,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      });
    }

    // Convert meals to an array if a single object is fetched
    meals = Array.isArray(meals) ? meals : [meals].filter(Boolean);

    return new Response(JSON.stringify(meals), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error fetching recipes:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }
}

export async function PUT(req) {
  const url = new URL(req.url);
  const searchParams = url.searchParams;
  const id = searchParams.get('id');
  const { actionType, newActionValue, ...data } = await req.json();

  console.log('id ***********************************', id);
  console.log('data ***********************************', data);
  try {
    // const meal = await prisma.meal?.findUnique({ where: { id } });
    // console.log('meal ***********************************', meal);

    if (actionType && newActionValue) {
      // دالة مساعدة لحساب القيم المحدثة
      function getUpdatedValue(currentValue, actionValue) {
        const newValue = currentValue + (actionValue === 1 ? 1 : -1);
        return newValue >= 0 ? newValue : currentValue;
      }

      let updateData = {};
      if (actionType === 'hearts') {
        updateData = { hearts: getUpdatedValue(meal?.hearts, newActionValue) };
      } else if (actionType === 'likes') {
        updateData = { likes: getUpdatedValue(meal?.likes, newActionValue) };
      } else if (actionType === 'emojis') {
        updateData = { emojis: getUpdatedValue(meal?.emojis, newActionValue) };
      }

      await prisma.meal?.update({
        where: { id },
        data: updateData,
      });

      return new Response(
        JSON.stringify({ message: 'تم التعديل بنجاح', newActionValue })
      );
    }

    await prisma.meal?.update({
      where: { id },
      data: data,
    });

    return new Response(JSON.stringify({ message: 'تم التعديل بنجاح' }));
  } catch (error) {
    console.error('Error updating meal:', error);
    return new Response(JSON.stringify({ error: 'حدث خطأ ما' }));
  }
}

export async function DELETE(req) {
  const { id, email } = await req.json();
  console.log(id);
  console.log(email);
  console.log(typeof id);

  // تحقق إذا كانت الوجبة موجودة وأن المستخدم صاحب الـ email قد أنشأها
  const mealExists = await prisma.meal.findFirst({
    where: { id: id, createdBy: email }, // استخدم id كنص و userEmail للتحقق
  });
  // console.log('mealExists', mealExists);

  if (!mealExists) {
    return new Response(
      JSON.stringify({
        error:
          'Meal not found or you do not have permission to delete this meal',
      }),
      {
        status: 404,
      }
    );
  }

  // تحقق واحذف القلوب المرتبطة (إذا وجدت)
  const heartsExist = await prisma.action?.findMany({
    where: { mealId: id, userEmail: email }, // استخدم id كنص
  });

  if (heartsExist?.length > 0) {
    await prisma.action?.deleteMany({
      where: { mealId: id, userEmail: email }, // استخدم id كنص
    });
  }

  // احذف الوجبة
  await prisma.meal?.delete({
    where: { id: id }, // استخدم id كنص
  });
  return new Response(
    JSON.stringify({
      message: 'تم الحذف بنجاح ✔',
    })
  );
}
