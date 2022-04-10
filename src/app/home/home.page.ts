import { Component } from '@angular/core';

import { LoadingController, NavController } from '@ionic/angular';
import { ApiService } from '../api.service';
import {Router} from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  shops : any;
  api : ApiService;
  private showOptions;

  constructor(public restapi: ApiService, 
    public loadingController: LoadingController, 
    public navController : NavController, 
    public router : Router,
    private alertController: AlertController,
    private toastController: ToastController
    ) {
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

  async getShops() {
    const loading = await this.loadingController.create({
      message: 'Loading'
    });

    await loading.present();
    await this.api.getShops()
      .subscribe(res => {
        console.log(res);
        this.shops = res.filter((aShop) => {
          return this.shops;
        });
        loading.dismiss();
      }, err => {
        console.log(err);
        loading.dismiss();
      });

  }

  async deleteShop(id:any){
    await this.api.deleteShop(id)
    .subscribe(res => {
        console.log(res);
        this.ngOnInit();
      }, (err) => {
        console.log(err);
      });
  }

  async doneShop(id:any){
    await this.api.doneShop(id)
    .subscribe(res => {
        console.log(res);
        this.ngOnInit();
      }, (err) => {
        console.log(err);
      });
  }

  done(id: any) {
    console.log("done");
    this.doneShop(id);
  }

  delete(id:any) {
    this.deleteShop(id);
  }

  ngOnInit() {
    this.getShops();
  }

  ionViewWillEnter() {
    this.ngOnInit();
  }

  async createShop(data)
  {
    await this.api.createShop(data)
    .subscribe(res => {
        this.getShops();
      }, (err) => {
        console.log(err);
      });
  }

  /**
   * Lance l'ajout d'un item dans la liste
   */
   async addShop() 
   {
    const alert = await this.alertController.create({
      cssClass: 'edit-alert',
      header: 'Nouveau',
      inputs: [
        {
          name: 'name',
          type: 'text',
          placeholder: 'Nom',
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
            this.createShop(JSON.stringify(data));
          }
        }
      ]
    });

    await alert.present();
  }

  async saveShop(id, data){
    await this.api.updateShop(id, data)
    .subscribe(res => {
        console.log(res);
        this.getShops();
      }, (err) => {
        console.log(err);
      });
  }

  async editShop(shop) {
    const alert = await this.alertController.create({
      cssClass: 'edit-alert',
      header: 'Edit',
      inputs: [
        {
          name: 'name',
          type: 'text',
          placeholder: shop[0].name,
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
            this.saveShop(shop[0]._id, JSON.stringify(data));
          }
        }
      ]
    });

    await alert.present();
  }

}
