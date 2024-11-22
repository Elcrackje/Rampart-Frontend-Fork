import {createRouter, createWebHistory} from "vue-router";
import HomeComponent from "../public/pages/home.component.vue";
import AboutComponent from "../public/pages/about.component.vue";
import ChefListComponent from "../chefs/pages/chef-list.component.vue";
import OrderListComponent from "../orders/pages/order-list.component.vue";
import PostListComponent from "../posting/pages/post-list.component.vue";
import DishListComponent from "../dishes/pages/dish-list.component.vue";
import FavoritePageComponent from "../favorites/pages/favorite-page.component.vue";
import PageNotFoundComponent from "../public/pages/page-not-found.component.vue";
import {authenticationGuard} from "../iam/services/authentication.guard.js";
import SignInComponent from "../iam/pages/sign-in.component.vue";
import SignUpComponent from "../iam/pages/sign-up.component.vue";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/home',                    name: 'home',       component: HomeComponent,               meta: { title: 'Home'} },
        { path: '/about',                   name: 'about',      component: AboutComponent,              meta: { title: 'About us'} },
        { path: '/chefs',   name: 'chefs', component: ChefListComponent, meta: { title: 'Chefs'}},
        { path: '/orders',   name: 'orders', component: OrderListComponent, meta: { title: 'Orders'}},
        { path: "/posts", name: 'posts', component: PostListComponent, meta: { title: 'Posts'}},
        { path: '/',                        redirect: '/home' },
        { path: '/dishes',   name: 'dishes', component: DishListComponent, meta: { title: 'Recipes'}},
        { path: '/favorites',   name: 'favorites', component: FavoritePageComponent, meta: { title: 'Favoritos'}},
        { path: '/sign-in',                 name: 'sign-in',    component: SignInComponent,             meta: { title: 'Sign In'}},
        { path: '/sign-up',                 name: 'sign-up',    component: SignUpComponent,             meta: { title: 'Sign Up'}},
        {path: '/:pathMatch(.*)*', component: PageNotFoundComponent},
    ]
});

router.beforeEach((to,
                   from,
                   next) => {
    let baseTitle = 'Sabores Cercanos';
    document.title = `${baseTitle} | ${to.meta['title']}`;
    authenticationGuard(to, from, next);
});
export default router;