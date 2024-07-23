import SideBar from '../components/SideBar';
import HomePage from '../components/HomePage';
import HomePageSidesPhotos from '../components/HomePageSidesPhotos';

export default function Home() {
  return (
    <div className="relative w-full flex justify-center ">
      <main className="flex items-start justify-center sm:rounded-3xl overflow-hidden z-50 h-fit w-full">
        <SideBar />
        <HomePage />
      </main>
      <HomePageSidesPhotos />
    </div>
  );
}
