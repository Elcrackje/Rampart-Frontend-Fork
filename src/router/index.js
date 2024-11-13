import {createRouter, createWebHistory} from "vue-router";
import HomeComponent from "../public/pages/home.component.vue";
import AboutComponent from "../public/pages/about.component.vue";
import ChefListComponent from "../chefs/pages/chef-list.component.vue";
import OrderListComponent from "../orders/pages/order-list.component.vue";
import PostListComponent from "../posting/pages/post-list.component.vue";
import DishListComponent from "../dishes/pages/dish-list.component.vue";
import UserProfileComponent from "../profile/pages/profile-page.component.vue";
import FavoritePageComponent from "../favorites/pages/favorite-page.component.vue";
import PageNotFoundComponent from "../public/pages/page-not-found.component.vue";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/home',                    name: 'home',       component: HomeComponent,               meta: { title: 'Home'} },
        { path: '/about',                   name: 'about',      component: AboutComponent,              meta: { title: 'About us'} },
        { path: '/chefs',   name: 'chefs', component: ChefListComponent, meta: { title: 'Chefs'}},
        { path: '/orders',   name: 'orders', component: OrderListComponent, meta: { title: 'Orders'}},
        { path: "/posts", name: 'posts', component: PostListComponent, meta: { title: 'Posts'}},
        { path: '/user-profile',            name: 'userProfile', component: UserProfileComponent, meta: { title: 'User Profile'} }, // Nueva ruta
        { path: '/',                        redirect: '/home' },
        { path: '/recipes',   name: 'recipes', component: DishListComponent, meta: { title: 'Recipes'}},
        { path: '/favorites',   name: 'favorites', component: FavoritePageComponent, meta: { title: 'Favoritos'}},
        {path: '/:pathMatch(.*)*', component: PageNotFoundComponent},
    ]
});

router.beforeEach((to,
                   from,
                   next) => {
    let baseTitle = 'ACME Learning Center';
    document.title = `${baseTitle} | ${to.meta['title']}`;
    next();
});
export default router;