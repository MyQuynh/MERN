"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserResolver = void 0;
const argon2 = __importStar(require("argon2"));
const type_graphql_1 = require("type-graphql");
const User_1 = require("../entities/User");
let UserNew = class UserNew {
};
__decorate([
    type_graphql_1.Field(() => String),
    __metadata("design:type", String)
], UserNew.prototype, "username", void 0);
__decorate([
    type_graphql_1.Field(() => String),
    __metadata("design:type", String)
], UserNew.prototype, "password", void 0);
UserNew = __decorate([
    type_graphql_1.InputType()
], UserNew);
let Error = class Error {
};
__decorate([
    type_graphql_1.Field(() => String),
    __metadata("design:type", String)
], Error.prototype, "field", void 0);
__decorate([
    type_graphql_1.Field(() => String),
    __metadata("design:type", String)
], Error.prototype, "message", void 0);
Error = __decorate([
    type_graphql_1.ObjectType()
], Error);
let UserRespond = class UserRespond {
};
__decorate([
    type_graphql_1.Field(() => [Error], { nullable: true }),
    __metadata("design:type", Array)
], UserRespond.prototype, "error", void 0);
__decorate([
    type_graphql_1.Field(() => User_1.User, { nullable: true }),
    __metadata("design:type", User_1.User)
], UserRespond.prototype, "user", void 0);
UserRespond = __decorate([
    type_graphql_1.ObjectType()
], UserRespond);
let UserResolver = class UserResolver {
    createUser({ em }, newUser) {
        return __awaiter(this, void 0, void 0, function* () {
            const hashPassword = yield argon2.hash(newUser.password);
            const user = em.create(User_1.User, { username: newUser.username, password: hashPassword });
            yield em.persistAndFlush(user);
            return user;
        });
    }
    ;
    login({ em }, newUser) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield em.findOne(User_1.User, { username: newUser.username });
            if (!user) {
                return {
                    error: [{
                            field: 'username',
                            message: "Could not find user"
                        }]
                };
            }
            const valid = argon2.verify(user.password, newUser.password);
            if (!valid) {
                return {
                    error: [{
                            field: 'password',
                            message: "Incorrect password"
                        }]
                };
            }
            return { user, };
        });
    }
    ;
};
__decorate([
    type_graphql_1.Mutation(() => User_1.User),
    __param(0, type_graphql_1.Ctx()),
    __param(1, type_graphql_1.Arg("userInfo")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, UserNew]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "createUser", null);
__decorate([
    type_graphql_1.Mutation(() => UserRespond),
    __param(0, type_graphql_1.Ctx()),
    __param(1, type_graphql_1.Arg("userInfo")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, UserNew]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "login", null);
UserResolver = __decorate([
    type_graphql_1.Resolver()
], UserResolver);
exports.UserResolver = UserResolver;
//# sourceMappingURL=user.js.map