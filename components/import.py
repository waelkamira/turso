import json
import csv

# Load JSON data
with open('meals.json', 'r', encoding='utf-8-sig') as file:
    json_data = json.load(file)

# Open a CSV file for writing
with open('meals.csv', 'w', newline='', encoding='utf-8') as csvfile:
    fieldnames = [
        'id', 'userName', 'createdBy', 'userImage', 'mealName', 'selectedValue', 
        'image', 'ingredients', 'theWay', 'advise', 'link', 'favorite', 
        'usersWhoLikesThisRecipe', 'usersWhoPutEmojiOnThisRecipe', 
        'usersWhoPutHeartOnThisRecipe', 'createdAt', 'updatedAt', 'version'
    ]
    writer = csv.DictWriter(csvfile, fieldnames=fieldnames)

    # Write header
    writer.writeheader()

    # Write data rows
    for item in json_data:
        writer.writerow({
            'id': item.get('_id', {}).get('$oid', ''),
            'userName': item.get('userName', ''),
            'createdBy': item.get('createdBy', ''),
            'userImage': item.get('userImage', ''),
            'mealName': item.get('mealName', ''),
            'selectedValue': item.get('selectedValue', ''),
            'image': item.get('image', ''),
            'ingredients': item.get('ingredients', ''),
            'theWay': item.get('theWay', ''),
            'advise': item.get('advise', ''),
            'link': item.get('link', ''),
            'favorite': 1 if item.get('favorite', False) else 0,
            'usersWhoLikesThisRecipe': json.dumps(item.get('usersWhoLikesThisRecipe', [])),
            'usersWhoPutEmojiOnThisRecipe': json.dumps(item.get('usersWhoPutEmojiOnThisRecipe', [])),
            'usersWhoPutHeartOnThisRecipe': json.dumps(item.get('usersWhoPutHeartOnThisRecipe', [])),
            'createdAt': item.get('createdAt', {}).get('$date', ''),
            'updatedAt': item.get('updatedAt', {}).get('$date', ''),
            'version': item.get('__v', 0)
        })

print("CSV file created successfully.")


# import json
# import csv

# # Load JSON data
# with open('users.json', 'r', encoding='utf-8-sig') as file:
#     json_data = json.load(file)

# # Open a CSV file for writing
# with open('users.csv', 'w', newline='', encoding='utf-8') as csvfile:
#     fieldnames = ['id', 'name', 'email', 'password', 'isAdmin', 'image', 'createdAt', 'updatedAt', 'googleId']
#     writer = csv.DictWriter(csvfile, fieldnames=fieldnames)

#     # Write header
#     writer.writeheader()

#     # Write data rows
#     for item in json_data:
#         writer.writerow({
#             'id': item.get('_id', {}).get('$oid', ''),
#             'name': item.get('name', ''),
#             'email': item.get('email', ''),
#             'password': item.get('password', ''),
#             'isAdmin': item.get('isAdmin', False),
#             'image': item.get('image', ''),
#             'createdAt': item.get('createdAt', {}).get('$date', ''),
#             'updatedAt': item.get('updatedAt', {}).get('$date', ''),
#             'googleId': item.get('googleId', '')
#         })

# print("CSV file created successfully.")



# //!     csv الى  meals.json لتحويل ملف 
# import json
# import csv

# # Load JSON data
# with open('users.json', 'r', encoding='utf-8-sig') as file:
#     json_data = json.load(file)

# # Open a CSV file for writing
# with open('users.csv', 'w', newline='', encoding='utf-8') as csvfile:
#     fieldnames = [
#         'id', 'userName', 'createdBy', 'userImage', 'mealName', 'selectedValue', 
#         'image', 'ingredients', 'theWay', 'advise', 'link', 'favorite', 
#         'usersWhoLikesThisRecipe', 'usersWhoPutEmojiOnThisRecipe', 
#         'usersWhoPutHeartOnThisRecipe', 'createdAt', 'updatedAt', 'version'
#     ]
#     writer = csv.DictWriter(csvfile, fieldnames=fieldnames)

#     # Write header
#     writer.writeheader()

#     # Write data rows
#     for item in json_data:
#         writer.writerow({
#             'id': item.get('_id', {}).get('$oid', ''),
#             'userName': item.get('userName', ''),
#             'createdBy': item.get('createdBy', ''),
#             'userImage': item.get('userImage', ''),
#             'mealName': item.get('mealName', ''),
#             'selectedValue': item.get('selectedValue', ''),
#             'image': item.get('image', ''),
#             'ingredients': item.get('ingredients', ''),
#             'theWay': item.get('theWay', ''),
#             'advise': item.get('advise', ''),
#             'link': item.get('link', ''),
#             'favorite': 1 if item.get('favorite', False) else 0,
#             'usersWhoLikesThisRecipe': json.dumps(item.get('usersWhoLikesThisRecipe', [])),
#             'usersWhoPutEmojiOnThisRecipe': json.dumps(item.get('usersWhoPutEmojiOnThisRecipe', [])),
#             'usersWhoPutHeartOnThisRecipe': json.dumps(item.get('usersWhoPutHeartOnThisRecipe', [])),
#             'createdAt': item.get('createdAt', {}).get('$date', ''),
#             'updatedAt': item.get('updatedAt', {}).get('$date', ''),
#             'version': item.get('__v', 0)
#         })

# print("CSV file created successfully.")
