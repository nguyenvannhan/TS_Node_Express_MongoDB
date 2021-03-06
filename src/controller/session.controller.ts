import {Request, Response} from "express";
import {validatePassword} from "../service/user.service";
import {createAccessToken, createSession, findSessions, updateSession} from "../service/session.service";
import {sign} from "../utils/jwt.utils";
import config from "config";
import {get} from "lodash";

export async function createSessionHandler(req: Request, res: Response) {
    // validate the email and password
    const user = await validatePassword(req.body);

    if (!user) {
        return res.status(401).send("Invalid Username or Password");
    }

    // Create a session
    const session = await createSession(user._id, req.get("user-agent") || "");

    // create Access Token
    const accessToken = createAccessToken({
        user,
        session
    });

    // create Refresh TOken
    const refreshToken = sign(session, {
        expiresIn: config.get('refreshTokenTtl') // 1 years
    });

    // send refersh & access token back
    return res.send({accessToken, refreshToken});
}

export async function invalidateUserSessionHandler(req: Request, res: Response) {
    const sessionId = get(req, "user.session");

    await updateSession({_id: sessionId}, {valid: false});

    return res.sendStatus(200);
}

export async function getUserSessionshandler(req: Request, res: Response) {
    const userId = get(req, "user._id");

    const sessions = await findSessions({user: userId, valid: true});

    return res.send(sessions);
}