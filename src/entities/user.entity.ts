import { Entity, PrimaryGeneratedColumn, Column, Index, BeforeInsert } from "typeorm";
import { States } from "./enums/states.enum";
import { encrypto } from 'pass-encrypto';

@Entity("user")
@Index(["key", "username"], { unique: true })
export class User {

  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("character varying", {
    length: 50,
    nullable: false
  })
  username: string;

  @Column("character varying", {
    length: 250,
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

  @BeforeInsert()
  hashPassword() {
    console.log(encrypto(this.password))
    this.password = encrypto(this.password);
  }
}