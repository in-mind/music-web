import FindMusic from "../pages/FindMusic";
import MyMusic from "../pages/MyMusic";


const routes = [
  {
    path: "/",
    component: FindMusic,
    exact: true
  },
  {
    path: "/my",
    component: MyMusic
  }
]

export default routes;