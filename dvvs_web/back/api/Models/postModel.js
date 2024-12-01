const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('web_dvvs', 'root', 'sireza42', {
    host: 'localhost',
    dialect: 'mysql',
});

const Post = sequelize.define('post', {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    author: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    timestamps: false,
});

module.exports = { Post, sequelize };


sequelize.sync({ force: true })
    .then(() => {
        console.log('Database & table created!');
    })
    .catch(err => console.error('Unable to connect to the database:', err));
