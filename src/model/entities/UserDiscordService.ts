import { 
  Column, 
  Entity, 
  JoinColumn, 
  ManyToOne,
} from "typeorm";
import { User } from "./User";
import { DiscordServiceType } from "./DiscordServiceType";

@Entity("user_discord_service", { schema: "wmm" })
export class UserDiscordService {
  @Column("varchar", {
    primary: true,
    name: "user_id",
    length: 30,
  })
  userId: string;

  @Column("varchar", {
    primary: true,
    name: "service_id",
    comment: "consulting_guide, consulting_notify",
    length: 20,
  })
  serviceId: string;

  @Column("datetime", {
    name: "created_dt",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdDt: Date;

  @Column("datetime", {
    name: "updated_dt",
    default: () => "CURRENT_TIMESTAMP",
  })
  updatedDt: Date;


  @ManyToOne(() => DiscordServiceType, (discordServiceType) => discordServiceType.userDiscordServices, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "push_code", referencedColumnName: "id" }])
  serviceId: DiscordServiceType;

  @ManyToOne(() => User, (user) => user.userDiscordServices, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user: User;
}
