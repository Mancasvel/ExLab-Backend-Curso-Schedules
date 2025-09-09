import { Model } from 'sequelize'

const loadModel = (sequelize, DataTypes) => {
  class Schedule extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {

      Schedule.belongsTo(models.Restaurant, { foreignKey: 'restaurantId', as: 'restaurant'})
      Schedule.hasMany(models.Product, {foreignKey: 'scheduleId', as: 'products'})  // pueden tener varios productos el mismo horario
    }
  }

  Schedule.init({

    startTime: {
      allowNull: false,
      type: DataTypes.TIME
    }, 
    endTime: {
      allowNull: false,
      type: DataTypes.TIME
    }, 
    /*
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: new Date()
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: new Date()
    },
    */ 
   //se pueden añadir o no, si timestamp esta activo por defecto los genera solo
    restaurantId: {

      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: 'Restaurants', // se pone s por que es nombre de la tabla no del modelo
        key: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    }

  }, {
    sequelize,
    modelName: 'Schedule',
    timeStamps: true  // asi gestiona por defecto los createdAt y los updatedAt
  })

  return Schedule
}

export default loadModel
