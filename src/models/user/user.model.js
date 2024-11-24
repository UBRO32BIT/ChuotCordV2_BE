const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const bcrypt = require('bcrypt');
const validator = require('validator');
const mongooseDelete = require('mongoose-delete');
const { string } = require('joi');

const OnlinePresenceEnum = Object.freeze({
    ONLINE: 'online',
    IDLE: 'idle',
    DO_NOT_DISTURB: 'doNotDisturb'
});

const users = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        require: true,
    },
    phoneNumber: {
        type: String,
        default: null,
    },
    profilePicture: {
        type: String,
        default: null,
    },
    guilds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Guilds',
    }],
    isEmailVerified: {
        type: Boolean,
        default: false,
        require: true,
    },
    onlinePresence: {
        type: String,
        enum: Object.values(OnlinePresenceEnum),
        default: OnlinePresenceEnum.ONLINE,
    }
},{timestamps: true})

users.plugin(mongooseDelete);
users.plugin(mongoosePaginate);

users.pre('save', async function (next){
    try {
        const user = this;
        if (!user.isModified('password')) {
            return next();
        }

        // Generate a salt and hash the password
        const saltRounds = 10;
        this.password = await bcrypt.hash(this.password, saltRounds);
        next();
    }
    catch (error) {
        next(error);
    }
});

const User = mongoose.model('Users', users);
module.exports = User;