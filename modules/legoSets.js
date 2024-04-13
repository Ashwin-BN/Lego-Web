require('dotenv').config();
const Sequelize = require('sequelize');

const sequelize = new Sequelize(process.env.PGDATABASE, process.env.PGUSER, process.env.PGPASSWORD, {
    host: process.env.PGHOST,
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: { rejectUnauthorized: false },
    },
});
sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((err) => {
    console.log("Unable to connect to the database:", err);
  });


const Set = sequelize.define('Set', {
    set_num: {
        type: Sequelize.STRING,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    year: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    num_parts: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    theme_id: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    img_url: {
        type: Sequelize.STRING,
        allowNull: false
    }},
    {
      createdAt: false, // disable createdAt
      updatedAt: false, // disable updatedAt
    }
);

const Theme = sequelize.define('Theme', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    }},
    {
      createdAt: false,
      updatedAt: false, 
    }
);

Set.belongsTo(Theme, { foreignKey: 'theme_id' });


async function initialize() {
    try {
      const result = await sequelize.sync();
      console.log('Connected successfully and synced models.');
    } catch (error) {
      console.error('Error connecting to database:', error);
      throw error;
    }
}

async function getAllSets() {
    return new Promise(async (resolve, reject) => {
      try {
        const allSets = Set.findAll({ include: [Theme.name] });
        resolve(allSets);
      } catch (error) {
        reject(new Error(error));
      }
    });
  }
  
  async function getAllThemes() {
    return new Promise(async (resolve, reject) => {
      try {
        const allThemes = Theme.findAll();
        resolve(allThemes);
      } catch (error) {
        reject(new Error(error));
      }
    })
  }
  
  async function getSetByNum(setNum) {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await Set.findOne({ where: { set_num: setNum }, include: [Theme] });
  
        if (!result) {
          reject("Unable to find requested set");
        } else {
          resolve(result);
        }
      } catch (error) {
        reject(new Error(`Error finding set: ${error.message}`));
      }
    });
  }
  
  async function getSetsByTheme(theme) {
    return new Promise(async (resolve, reject) => {
      try {
        const sets = await Set.findAll({
          include: [Theme],
          where: {
            '$Theme.name$': {
              [Sequelize.Op.iLike]: `%${theme}%`
            }
          }
        });
  
        if (sets.length > 0) {
          resolve(sets);
        } else {
          reject("Unable to find requested sets");
        }
      } catch (error) {
        reject(new Error(error));
      }
    });
  }
  
  async function addSet(setData) {
    console.log('setData:', setData);
    return new Promise(async (resolve, reject) => {
      try {
        initialize();
        await Set.create({
          name: setData.name,
          year: setData.year,
          num_parts: setData.num_parts,
          img_url: setData.img_url,
          theme_id: setData.theme_id,
          set_num: setData.set_num,
        });
        resolve();
      } catch (error) {
        reject(new Error(error));
      }
  
    });
  }
  
  async function editSet(set_num, setData) {
    return new Promise(async (resolve, reject) => {
      try {
        const [rowsUpdated, [updatedSet]] = await Set.update(setData, {
          where: { set_num: set_num },
          returning: true
        });
  
        if (rowsUpdated === 0) {
          throw new Error('Set not found or not updated');
        }
  
        resolve(updatedSet);
      } catch (error) {
        reject(new Error(error.errors[0].message));
      }
    });
  }
  
  async function deleteSet(set_num) {
    return new Promise(async (resolve, reject) => {
      try {
        const deletedRows = await Set.destroy({
          where: { set_num: set_num }
        });
  
        if (deletedRows === 0) {
          throw new Error('Set not found or not deleted');
        }
        resolve();
      } catch (error) {
        reject(new Error(error));
      }
    })
  }
  
  module.exports = { initialize, getAllSets, getSetByNum, getSetsByTheme, getAllThemes, addSet, editSet, deleteSet };