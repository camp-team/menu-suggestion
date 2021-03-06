import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MyMenu, DayMenu, DayMenuWithFood } from '@interfaces/my-menu';
import { Observable, combineLatest, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { FoodService } from './food.service';

@Injectable({
  providedIn: 'root',
})
export class MyMenuService {
  constructor(private db: AngularFirestore, private foodService: FoodService) {}

  getMyMenuById(myMenuId: string): Observable<MyMenu> {
    return this.db.doc<MyMenu>(`myMenus/${myMenuId}`).valueChanges();
  }

  getMyMenuByUserId(userId: string): Observable<MyMenu> {
    return this.db
      .collection<MyMenu>('myMenus', (ref) => {
        return ref.where('creatorId', '==', userId);
      })
      .valueChanges()
      .pipe(map((myMenus: MyMenu[]) => myMenus[0]));
  }

  getDayMenuWithFoods(userId: string): Observable<DayMenuWithFood[] | null> {
    return this.getMyMenuByUserId(userId).pipe(
      map((myMenu: MyMenu) => {
        const day = myMenu?.day;
        if (day) {
          return [
            day?.sunday,
            day?.monday,
            day?.tuesday,
            day?.wednesday,
            day?.thursday,
            day?.friday,
            day?.saturday,
          ];
        } else {
          return null;
        }
      }),
      switchMap(
        (dayMenus: DayMenu[]): Observable<DayMenuWithFood[] | null> => {
          if (dayMenus) {
            const dayMenuWithFoods$: Observable<
              DayMenuWithFood
            >[] = dayMenus.map((dayMenu: DayMenu) => {
              return combineLatest([
                this.foodService.getFoodById(dayMenu.breakfastId),
                this.foodService.getFoodById(dayMenu.lunchId),
                this.foodService.getFoodById(dayMenu.dinnerId),
              ]).pipe(
                map(([breakfast, lunch, dinner]) => {
                  return {
                    breakfast,
                    lunch,
                    dinner,
                    dayOfWeek: '',
                  };
                })
              );
            });
            return combineLatest(dayMenuWithFoods$).pipe(
              map((dayMenuWithFoods: DayMenuWithFood[]) => {
                const dayOfWeeks = ['日', '月', '火', '水', '木', '金', '土'];
                dayMenuWithFoods.forEach(
                  (dayMenuWithFood: DayMenuWithFood, i: number) => {
                    dayMenuWithFood.dayOfWeek = dayOfWeeks[i];
                  }
                );
                return dayMenuWithFoods;
              })
            );
          } else {
            return of(null);
          }
        }
      )
    );
  }

  getTodayMenu(userId: string): Observable<DayMenuWithFood | null> {
    return this.getDayMenuWithFoods(userId).pipe(
      map((dayMenuWithFoods: DayMenuWithFood[]) => {
        const today = new Date();
        const dayOfWeek = today.getDay();
        if (dayMenuWithFoods) {
          return dayMenuWithFoods[dayOfWeek];
        } else {
          return null;
        }
      })
    );
  }

  changeMyMenu(
    myMenuId: string,
    dayOfWeek: number,
    time: string,
    foodId: string
  ): Promise<void> {
    switch (dayOfWeek) {
      case 0:
        if (time === 'morning') {
          return this.db.doc(`myMenus/${myMenuId}`).update({
            'day.sunday.breakfastId': foodId,
          });
        } else if (time === 'noon') {
          return this.db.doc(`myMenus/${myMenuId}`).update({
            'day.sunday.lunchId': foodId,
          });
        } else if (time === 'night') {
          return this.db.doc(`myMenus/${myMenuId}`).update({
            'day.sunday.dinnerId': foodId,
          });
        }
        break;
      case 1:
        if (time === 'morning') {
          return this.db.doc(`myMenus/${myMenuId}`).update({
            'day.monday.breakfastId': foodId,
          });
        } else if (time === 'noon') {
          return this.db.doc(`myMenus/${myMenuId}`).update({
            'day.monday.lunchId': foodId,
          });
        } else if (time === 'night') {
          return this.db.doc(`myMenus/${myMenuId}`).update({
            'day.monday.dinnerId': foodId,
          });
        }
        break;
      case 2:
        if (time === 'morning') {
          return this.db.doc(`myMenus/${myMenuId}`).update({
            'day.tuesday.breakfastId': foodId,
          });
        } else if (time === 'noon') {
          return this.db.doc(`myMenus/${myMenuId}`).update({
            'day.tuesday.lunchId': foodId,
          });
        } else if (time === 'night') {
          return this.db.doc(`myMenus/${myMenuId}`).update({
            'day.tuesday.dinnerId': foodId,
          });
        }
        break;
      case 3:
        if (time === 'morning') {
          return this.db.doc(`myMenus/${myMenuId}`).update({
            'day.wednesday.breakfastId': foodId,
          });
        } else if (time === 'noon') {
          return this.db.doc(`myMenus/${myMenuId}`).update({
            'day.wednesday.lunchId': foodId,
          });
        } else if (time === 'night') {
          return this.db.doc(`myMenus/${myMenuId}`).update({
            'day.wednesday.dinnerId': foodId,
          });
        }
        break;
      case 4:
        if (time === 'morning') {
          return this.db.doc(`myMenus/${myMenuId}`).update({
            'day.thursday.breakfastId': foodId,
          });
        } else if (time === 'noon') {
          return this.db.doc(`myMenus/${myMenuId}`).update({
            'day.thursday.lunchId': foodId,
          });
        } else if (time === 'night') {
          return this.db.doc(`myMenus/${myMenuId}`).update({
            'day.thursday.dinnerId': foodId,
          });
        }
        break;
      case 5:
        if (time === 'morning') {
          return this.db.doc(`myMenus/${myMenuId}`).update({
            'day.friday.breakfastId': foodId,
          });
        } else if (time === 'noon') {
          return this.db.doc(`myMenus/${myMenuId}`).update({
            'day.friday.lunchId': foodId,
          });
        } else if (time === 'night') {
          return this.db.doc(`myMenus/${myMenuId}`).update({
            'day.friday.dinnerId': foodId,
          });
        }
        break;
      case 6:
        if (time === 'morning') {
          return this.db.doc(`myMenus/${myMenuId}`).update({
            'day.saturday.breakfastId': foodId,
          });
        } else if (time === 'noon') {
          return this.db.doc(`myMenus/${myMenuId}`).update({
            'day.saturday.lunchId': foodId,
          });
        } else if (time === 'night') {
          return this.db.doc(`myMenus/${myMenuId}`).update({
            'day.saturday.dinnerId': foodId,
          });
        }
        break;
    }
  }

  changeMyMenuToUserMenu(
    myMenuId: string,
    userMenu: {
      sunday: DayMenu;
      monday: DayMenu;
      tuesday: DayMenu;
      wednesday: DayMenu;
      thursday: DayMenu;
      friday: DayMenu;
      saturday: DayMenu;
    }
  ): Promise<void> {
    return this.db.doc<MyMenu>(`myMenus/${myMenuId}`).update({
      day: userMenu,
    });
  }
}
