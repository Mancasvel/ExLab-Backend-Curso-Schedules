import * as ScheduleValidation from '../controllers/validation/ScheduleValidation.js'
import ScheduleController from '../controllers/ScheduleController.js'
import { isLoggedIn, hasRole } from '../middlewares/AuthMiddleware.js'
import { handleValidation } from '../middlewares/ValidationHandlingMiddleware.js'
import { checkEntityExists } from '../middlewares/EntityMiddleware.js'
import * as RestaurantMiddleware from '../middlewares/RestaurantMiddleware.js'
import { Schedule, Restaurant } from '../models/models.js'

const loadScheduleRoutes = function (app) {

  app.route('/restaurants/:restaurantId/schedules')
    .get(
      isLoggedIn,  // con isLoggedIn ya se verifica que sea usuario
      ScheduleController.index
    )
    .post(
      isLoggedIn,
      hasRole('owner'),
      ScheduleValidation.create,
      handleValidation,
      RestaurantMiddleware.checkRestaurantOwnership,  //validacion de pertenencia
      ScheduleController.create
    );

    app.route('/restaurants/:restaurantId/schedules/:scheduleId')
    .put(
      isLoggedIn,
      hasRole('owner'),
      checkEntityExists(Schedule, 'scheduleId'),
      RestaurantMiddleware.checkRestaurantOwnership,
      ScheduleValidation.update,
      handleValidation,
      ScheduleController.update
    )
    .delete(
      isLoggedIn,
      hasRole('owner'),
      checkEntityExists(Schedule, 'scheduleId'),
      RestaurantMiddleware.checkRestaurantOwnership,
      ScheduleController.destroy
    )

}

export default loadScheduleRoutes
