import { Schedule } from '../models/models.js'
import { validateTimeFormat, validateEndTimeAfterStartTime } from '../controllers/validation/ScheduleValidation.js';


// rf1
const indexRestaurant = async function (req, res) {
  try {
    // Aseguramos que req.restaurant existe
    if (!req.restaurant || !req.restaurant.id) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    const schedules = await Schedule.findAll({
      where: { restaurantId: req.restaurant.id }
    });

    res.status(200).json(schedules);

  } catch (error) {
    console.error('Error en ScheduleController.index:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// rf2
const create = async function (req, res) {
  try {
    // 1️⃣ Verificar que el usuario esté logueado
    if (!req.user) {
      return res.status(401).json({ message: 'User is not logged in' });
    }

    // 2️⃣ Verificar que el restaurante exista
    if (!req.restaurant) {
      return res.status(404).json({ message: 'Restaurant does not exist' });
    }

    // 3️⃣ Verificar que el usuario sea el propietario
    const userId = req.user.id;
    const restaurantOwnerId = req.restaurant.userId;
    if (userId !== restaurantOwnerId) {
      return res.status(403).json({ message: 'User is not the restaurant owner' });
    }

    // 4️⃣ Validar los atributos startTime y endTime
    const { startTime, endTime } = req.body;

    if (!startTime || !endTime) {
      return res.status(422).json({ message: 'startTime and endTime are required' });
    }

    try {
      validateTimeFormat(startTime);
      validateTimeFormat(endTime);
      validateEndTimeAfterStartTime(endTime, { body: { startTime } });
    } catch (validationError) {
      return res.status(422).json({ message: validationError.message });
    }

    // 5️⃣ Crear el schedule
    const schedule = await Schedule.create({
      startTime,
      endTime,
      restaurantId: req.restaurant.id
    });

    return res.status(201).json(schedule);

  } catch (error) {
    console.error('Error creating a schedule:', error);
    return res.status(500).json({ message: 'Internal Server Error', error });
  }
};
// rf3
const update = async (req, res) => {
  try {
    // 1️⃣ Usuario logueado
    if (!req.user) {
      return res.status(401).json({ message: 'User is not logged in' });
    }

    // 2️⃣ Restaurante existe
    if (!req.restaurant) {
      return res.status(404).json({ message: 'Restaurant does not exist' });
    }

    // 3️⃣ Usuario es propietario
    if (req.user.id !== req.restaurant.userId) {
      return res.status(403).json({ message: 'User is not the restaurant owner' });
    }

    // 4️⃣ Horario existe
    const schedule = await Schedule.findByPk(req.params.scheduleId);  //definimos aqui schedule que lo usaremos luego para actualizarlo
    if (!schedule || schedule.restaurantId !== req.restaurant.id) {
      return res.status(404).json({ message: 'Schedule not found' });
    }

    // 5️⃣ Validación de atributos
    const { startTime, endTime } = req.body;
    if (!startTime || !endTime) {
      return res.status(422).json({ message: 'startTime and endTime are required' });
    }

    try {
      validateTimeFormat(startTime);
      validateTimeFormat(endTime);
      validateEndTimeAfterStartTime(endTime, { body: { startTime } });
    } catch (validationError) {
      return res.status(422).json({ message: validationError.message });
    }

    // 6️⃣ Actualizar el horario
    await schedule.update({ startTime, endTime });

    return res.status(200).json(schedule);

  } catch (error) {
    console.error('Error updating schedule:', error);
    return res.status(500).json({ message: 'Internal Server Error', error });  // en otras soluciones ponen error 400 por defecto
  }
};

// rf4
const destroy = async function (req, res) {
  try {
    // 1️⃣ Usuario logueado
    if (!req.user) {
      return res.status(401).json({ message: 'User is not logged in' });
    }

    // 2️⃣ Restaurante existe
    if (!req.restaurant) {
      return res.status(404).json({ message: 'Restaurant does not exist' });
    }

    // 3️⃣ Usuario es propietario
    if (req.user.id !== req.restaurant.userId) {
      return res.status(403).json({ message: 'User is not the restaurant owner' });
    }

    // 4️⃣ Horario existe
    const schedule = await Schedule.findByPk(req.params.scheduleId);
    if (!schedule || schedule.restaurantId !== req.restaurant.id) {
      return res.status(404).json({ message: 'Schedule not found' });
    }

    // 5️⃣ Eliminar el horario
    await schedule.destroy();

    return res.status(200).json({ message: 'Schedule deleted successfully' });

  } catch (error) {
    console.error('Error deleting schedule:', error);
    return res.status(500).json({ message: 'Internal Server Error', error });
  }
};


const ScheduleController = {
  indexRestaurant,
  create,
  update,
  destroy
}

export default ScheduleController
