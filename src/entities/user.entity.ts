import { Entity, PrimaryGeneratedColumn, Column, Index } from "typeorm";
import { States } from "./enums/states.enum";

@Entity("user")
@Index(["key"], { unique: true })
export class User {

  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("character varying", {
    length: 50,
    nullable: false
  })
  username: string;

  @Column("character varying", {
    length: 50,
    nullable: false
  })
  password: string;

  @Column("uuid", { nullable: false })
  key: string;

  @Column("enum", {
    enum: States,
    default: States.Active,
    nullable: false
  })
  state: States
}