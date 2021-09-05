import User, {UserDocument} from "../model/user.model";
import {DocumentDefinition, FilterQuery} from 'mongoose';
import {omit} from "lodash";

export async function createUser(input: DocumentDefinition<UserDocument>) {
    try {
        return await User.create(input);
    } catch (error) {
        // @ts-ignore
        throw new Error(error);
    }
}

export async function findUser(query: FilterQuery<UserDocument>) {
    return User.findOne(query).lean();
}

export async function validatePassword({email, password}: {
    email: UserDocument["email"];
    password: string;
}) {
    const user = await User.findOne({email});

    if (!user) {
        return false;
    }

    const isvalid = await user.comparePassword(password);

    if (!isvalid) {
        return false;
    }

    return omit(user.toJSON(), "password");
}