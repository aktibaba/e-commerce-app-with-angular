import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { loadStripe } from '@stripe/stripe-js';
import { Subscription } from 'rxjs';
import { Cart, CartItem } from 'src/app/models/cart.model';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl:'./cart.component.html' 
})
export class CartComponent implements OnInit {

  cart: Cart ={items:[
    {
      product: "https://via.placeholder.com/150",
      name:"snekear",
      price:150,
      quantity:1,
      id:1
    }
  ]};
  dataSource: Array<CartItem> =[];
  displayedColumns :Array<string> = [
    'product',
    'name',
    'price',
    'quantity',
    'total',
    'action'
  ];
  cartSubscription: Subscription | undefined;

  constructor(private cartService: CartService, private http: HttpClient) {}

  ngOnInit(): void {
    this.cartService.cart.subscribe((_cart:Cart)=>{
      this.cart=_cart;
      this.dataSource =this.cart.items;
    })
    
  }
getTotal(items: Array<CartItem>):number{
  return this.cartService.getTotal(items);
}
onClearCart():void{
this.cartService.clearCart();
}
onRemoveFromCart(item:CartItem):void {
  this.cartService.removeFromCart(item);
}
onAddQuantity(item:CartItem):void {
  this.cartService.addToCart(item);

}
onRemoveQuantity(item:CartItem):void{
  this.cartService.removeQuantity(item);

}
onCheckout(): void {
  this.http
    .post('http://localhost:4242/checkout', {
      items: this.cart.items,
    })
    .subscribe(async (res: any) => {
      let stripe = await loadStripe('pk_test_51MDLwQD70ozXlj5SvqMs5NpHp45zYJVn0F63l2ERtmrVJUMCuNuAvqzoIDYLWLomH5HD0gAJ2rjcmYeONxNVQoRe00u31jAvNk');
      stripe?.redirectToCheckout({
        sessionId: res.id,
      });
    });
}
ngOnDestroy() {
  if (this.cartSubscription) {
    this.cartSubscription.unsubscribe();
  }
}

}
