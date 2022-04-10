import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { ApiService } from '../api.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-product',
  templateUrl: './product.page.html',
  styleUrls: ['./product.page.scss'],
})
export class ProductPage implements OnInit {

  products: any;
  category: any;
  shop : any;
  api : ApiService; 
  private showOptions; 

  constructor(
    public restapi: ApiService, 
    public loadingController: LoadingController, 
    private route: ActivatedRoute, 
    public router : Router,
    private alertController: AlertController,
    private toastController: ToastController) 
  {
    // Ecoute les événéments de clic sur le bouton physique de retour Android
    document.addEventListener('ionBackButton', () => {
      if (this.showOptions) {
        // Fermeture ou ouverture des options
        // this.showOrHideAddOptions();
        // Récupère le composant maître de la page
        const appContainer = window.document.getElementById("app-root");
        if (appContainer !== null) {
          appContainer.classList.remove("hidden");
        }
      } else {
        // Sinon, on quitte l'application
        navigator['app'].exitApp();
      }
    })

    this.api = restapi;
  }

  async getShop(id) {
    const loading = await this.loadingController.create({
      message: 'Loading'
    });
    
    await loading.present();
    await this.api.getShop(id)
    .subscribe(res => {
      console.log(res);
      this.shop = res;
      loading.dismiss();
    }, err => {
      console.log(err);
      loading.dismiss();
    });
  }

  async getCategory(id) {
    const loading = await this.loadingController.create({
      message: 'Loading'
    });
    
    await loading.present();
    await this.api.getCategory(id)
    .subscribe(res => {
      console.log(res);
      this.category = res;
      loading.dismiss();
    }, err => {
      console.log(err);
      loading.dismiss();
    });
  }

  async getProducts() {
    const loading = await this.loadingController.create({
      message: 'Loading'
    });

    await loading.present();
    await this.api.getProducts(this.route.snapshot.paramMap.get('id_category'))
      .subscribe(res => {
        console.log(res);
        this.products = res;
        loading.dismiss();
      }, err => {
        console.log(err);
        loading.dismiss();
      });
  }

  ngOnInit() {
    this.getShop(this.route.snapshot.paramMap.get('id_shop'));
    this.getCategory(this.route.snapshot.paramMap.get('id_category'));
    this.getProducts()
  }

  async createProduct(data)
  {
    await this.api.createProduct(data)
    .subscribe(res => {
        this.getProducts();
      }, (err) => {
        console.log(err);
      });
  }

  async addProduct() 
   {
    const alert = await this.alertController.create({
      cssClass: 'edit-alert',
      header: 'Nouvelle article',
      inputs: [
        {
          name: 'title',
          type: 'text',
          placeholder: 'Titre',
        },
        {
          name: 'description',
          type: 'text',
          placeholder: 'Description',
        },
        {
          name : 'quantity',
          type : 'number',
          placeholder: 'Quantité', 
        }
      ],
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Action annulée');
          }
        }, {
          text: 'Ok',
          handler: (data) => {
            data.category_id = this.category._id;
            this.createProduct(JSON.stringify(data));
          }
        }
      ]
    });
    await alert.present();
  }

  async saveProduct(id, data){
    await this.api.updateProduct(id, data)
    .subscribe(res => {
        console.log(res);
        this.getProducts();
      }, (err) => {
        console.log(err);
      });
  }

  async editProduct(product) 
  {
    const alert = await this.alertController.create({
      cssClass: 'edit-alert',
      header: product.title,
      inputs: [
        {
          name: 'title',
          type: 'text',
          value: product.title,
          placeholder: product.title,
        },
        {
          name: 'description',
          type: 'text',
          value: product.description,
          placeholder: product.description,
        },
        {
          name : 'quantity',
          type : 'number',
          value: product.quantity,
          placeholder: product.quantity, 
        }
      ],
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Action annulée');
          }
        }, {
          text: 'Ok',
          handler: (data) => {
            this.saveProduct(product._id, JSON.stringify(data));
          }
        }
      ]
    });
    await alert.present();
  }

  async deleteProduct(id:any){
    await this.api.deleteProduct(id)
    .subscribe(res => {
        console.log(res);
        this.ngOnInit();
      }, (err) => {
        console.log(err);
      });
  }

  delete(id:any) {
    this.deleteProduct(id);
  }
}
