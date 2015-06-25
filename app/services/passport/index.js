//Passport Config

module.exports = function (passport, models) {
    require('./facebook')(passport, models);
    require('./google')(passport, models);
    require('./github')(passport, models);
    require('./local')(passport, models);
    require('./session')(passport, models);
    require('./twitter')(passport, models);
};
