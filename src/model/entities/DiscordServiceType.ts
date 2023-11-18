import { 
  Column, 
  Entity, 
  OneToMany,
} from "typeorm";
import { UserDiscordService } from "./UserDiscordService";

@Entity("discord_service_type", { schema: "wmm" })
export class DiscordServiceType {
  @Column("varchar", {
    primary: true,
    name: "id",
    comment: "[user_discord_service] - service_id",
    length: 20,
  })
  id: string;

  @Column("varchar", {
    name: "description",
    length: 50,
  })
  description: string;

  @OneToMany(() => UserDiscordService, (userDiscordService) => userDiscordService.serviceId)
  userDiscordServices: UserDiscordService[];
}
