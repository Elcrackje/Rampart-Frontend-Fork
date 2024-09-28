import {createRouter, createWebHistory} from "vue-router";
import HomeComponent from "../public/pages/home.component.vue";
import AboutComponent from "../public/pages/about.component.vue";
import ChefListComponent from "../chefs/pages/chef-list.component.vue";
import NutrientListComponent from "../nutrients/pages/nutrient-list.component.vue";
import RecipeListComponent from "../../../../Webstorm-files/cocineros-bounded-context/src/recipes/pages/recipe-list.component.vue";
import DishListComponent from "../../../../Webstorm-files/cocineros-bounded-context/src/dishes/pages/dish-list.component.vue";
import OrderListComponent from "../../../../Webstorm-files/cocineros-bounded-context/src/orders/pages/order-list.component.vue";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/home',                    name: 'home',       component: HomeComponent,               meta: { title: 'Home'} },
        { path: '/about',                   name: 'about',      component: AboutComponent,              meta: { title: 'About us'} },
        { path: '/chefs',   name: 'chefs', component: ChefListComponent, meta: { title: 'Chefs'}},
        { path: '/orders',   name: 'orders', component: OrderListComponent, meta: { title: 'Orders'}},
        { path: '/recipes',   name: 'recipes', component: RecipeListComponent, meta: { title: 'Recipes'}},
        { path: '/dishes',   name: 'dishes', component: DishListComponent, meta: { title: 'Dishes'}},
        { path: '/nutrients',   name: 'nutrients', component: NutrientListComponent, meta: { title: 'Nutrients'}},
        { path: '/',                        redirect: '/home' }
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