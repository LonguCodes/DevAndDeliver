import {post} from "../core/routes/decorators";
import {request} from "../core/request/decorators";
import {GlobalContext} from "../core/context/global";
import {DatasourceBindings} from "../datasources/bindings";
import {HttpErrors} from "../core/errors";
import bcrypt from "bcrypt";
import {promisify} from "util";
import {User} from "../core/auth/types";
import moment from "moment";
import jwt from 'jsonwebtoken'
import {AuthBindings} from "../core/auth/bindings";
import math from "mathjs";

interface Credentials {
    login: string;
    password: string
}

const sessionLength = 30;

export class AuthController {
    @post('/auth/login')
    async login(
        @request.body {login, password}: Credentials
    ) {

        if (!login || !password)
            throw new HttpErrors.BadRequest('Missing username or password')

        const mongo = GlobalContext.get().getValue(DatasourceBindings.Mongo)
        if (!mongo)
            throw new Error("Can't access mongo db");

        const user: User = await mongo.collection('user').findOne({login})
        if (!user)
            throw new HttpErrors.Unauthorized('Incorrect login or password')

        try {
            await promisify(bcrypt.compare)(password, user.password)
        } catch {
            throw new HttpErrors.Unauthorized('Incorrect login or password')
        }

        const result = await mongo.collection('session').insertOne({
            userId: user._id,
            expiresAt: moment.utc().add(sessionLength, 'minutes').toISOString(),
        })
        return jwt.sign(
            {
                userId: user._id,
                sessionId: result.insertedId,
            },
            GlobalContext.get().getValue(AuthBindings.Secret) as string
        )
    }

    @post('/auth/register')
    async register(
        @request.body {login, password}: Credentials
    ) {
        if (!login || !password)
            throw new HttpErrors.BadRequest('Missing username or password')

        const mongo = GlobalContext.get().getValue(DatasourceBindings.Mongo)
        if (!mongo)
            throw new Error("Can't access database");

        const axios = GlobalContext.get().getValue(DatasourceBindings.Axios)
        if (!axios)
            throw new Error("Can't access axios");

        if (await mongo.collection('user').findOne({login}))
            throw new HttpErrors.BadRequest('User already exists')

        const passwordEncrypted = await bcrypt.hash(password, 4)

        const heroes = await axios.get('/people')
        const heroId = math.randomInt(0, heroes.data.count)
        await mongo.collection('user').insertOne({
            login,
            password: passwordEncrypted,
            heroId
        })
    }
}