import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { ApiService } from '../api.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-category',
  templateUrl: './category.page.html',
  styleUrls: ['./category.page.scss'],
})
export class CategoryPage implements OnInit 
{
  shop : any;
  api : ApiService;
  categories : any;
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

  async getCategories() {
    const loading = await this.loadingController.create({
      message: 'Loading'
    });

    await loading.present();
    await this.api.getCategories(this.route.snapshot.paramMap.get('id'))
      .subscribe(res => {
        console.log(res);
        this.categories = res;
        loading.dismiss();
      }, err => {
        console.log(err);
        loading.dismiss();
      });
  }

  ngOnInit() {
    this.getShop(this.route.snapshot.paramMap.get('id'));
    this.getCategories();
  }

  async createCategory(data)
  {
    await this.api.createCategory(data)
    .subscribe(res => {
        this.getCategories();
      }, (err) => {
        console.log(err);
      });
  }

  /**
   * Lance l'ajout d'un item dans la liste
   */
   async addCategory() 
   {
    const alert = await this.alertController.create({
      cssClass: 'edit-alert',
      header: 'Nouvelle catégorie',
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
            data.shop_id = this.shop._id;
            this.createCategory(JSON.stringify(data));
          }
        }
      ]
    });

    await alert.present();
  }

  async deleteCategory(id:any){
    await this.api.deleteCategory(id)
    .subscribe(res => {
        console.log(res);
        this.ngOnInit();
      }, (err) => {
        console.log(err);
      });
  }

  delete(id:any) {
    this.deleteCategory(id);
  }

  async saveCategory(id, data){
    await this.api.updateCategory(id, data)
    .subscribe(res => {
        console.log(res);
        this.getCategories();
      }, (err) => {
        console.log(err);
      });
  }

  async editCategory(category) {
    const alert = await this.alertController.create({
      cssClass: 'edit-alert',
      header: 'Edit',
      inputs: [
        {
          name: 'title',
          type: 'text',
          value: category.title,
          placeholder: category.title,
        },
        {
          name: 'description',
          type: 'text',
          value: category.description,
          placeholder: category.description,
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
            this.saveCategory(category._id, JSON.stringify(data));
          }
        }
      ]
    });
    await alert.present();
  }
}
