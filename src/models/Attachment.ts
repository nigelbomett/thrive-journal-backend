import { DataTypes, Model, Optional } from "sequelize";
import {sequelize} from '../config/db';


interface AttachmentAttributes{
    id:number;
    journalEntryId:number;
    filePath:string;
    fileType:string;
}

interface AttachmentCreationAttributes extends Optional<AttachmentAttributes,'id'>{} //id auto-generated in the database

export class Attachment extends Model<AttachmentAttributes,AttachmentCreationAttributes> implements AttachmentAttributes{
    public id!: number;
    public journalEntryId!: number;
    public filePath!: string;
    public fileType!: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Attachment.init({
    id:{
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement:true,
        primaryKey:true
    },
    journalEntryId:{
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull:false
    },
    filePath:{
        type: DataTypes.STRING(128),
        allowNull: false
    },
    fileType:{
        type: DataTypes.STRING(128),
        allowNull:false
    }
},{
    tableName:'attachments',
    sequelize
})