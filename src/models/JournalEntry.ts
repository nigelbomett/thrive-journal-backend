import { DataTypes, Model, Optional } from "sequelize";
import {sequelize} from '../config/db'

interface JournalEntryAttributes{
    id:number;
    userId:number;
    title:string;
    content:string;
    category:string;
    date:Date;
}

interface JournalEntryCreationAttributes extends Optional<JournalEntryAttributes,'id'>{}

export class JournalEntry extends Model<JournalEntryAttributes,JournalEntryCreationAttributes> implements JournalEntryAttributes{
    public id!: number;
    public userId!: number;
    public title!: string;
    public content!: string;
    public category!: string;
    public date!: Date;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

JournalEntry.init(
    {
    id:{
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey:true
    },
    userId:{
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull:false
    },
    title:{
        type: DataTypes.STRING(128),
        allowNull:false
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    category: {
        type: DataTypes.STRING(128),
        allowNull: false
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false
    }
},{
    tableName:'journal_entries',
    sequelize
})