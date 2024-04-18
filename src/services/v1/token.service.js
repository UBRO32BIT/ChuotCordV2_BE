const jwt = require('jsonwebtoken');
const TokenModel = require('../../models/token.model')

class TokenService {
    async GenerateToken(data, type, secretKey, tokenLife) {
        const {_id} = data;
        const payload = {
            sub: _id,
            type: type,
        }
        return jwt.sign(payload, secretKey, {
            expiresIn: tokenLife,
        });
    }
    async SaveTokenToDB(token, type, exp) {
        return await TokenModel.create({
            token: token,
            type: type,
            expires: exp.toDate(),
        });
    }
}
module.exports = new TokenService;
