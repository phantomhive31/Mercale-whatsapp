import AppError from "../../errors/AppError";
import Setting from "../../models/Setting";

interface Request {
  key: string;
  user: {
    profile: string;
    companyId: number;
  };
}

// keys that can be accessed by non-admin users
// with respective default values
const safeSettingsKeys = {
  groupsTab: "disabled",
  CheckMsgIsGroup: "disabled",
  soundGroupNotifications: "disabled",
  tagsMode: "ticket"
};

export const GetSettingService = async ({
  key,
  user
}: Request): Promise<string> => {
  if (user.profile !== "admin" && !(key in safeSettingsKeys)) {
    throw new AppError("ERR_NO_PERMISSION", 403);
  }

  let setting = await Setting.findOne({
    where: {
      companyId: user.companyId,
      key
    }
  });

  // Criar configuração priceBotEnabled automaticamente se não existir
  if (!setting && key === "priceBotEnabled") {
    setting = await Setting.create({
      companyId: user.companyId,
      key: "priceBotEnabled",
      value: "disabled"
    });
  }

  if (!setting && key in safeSettingsKeys) {
    return safeSettingsKeys[key];
  }

  return setting?.value || "";
};
