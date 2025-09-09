import AppError from "../../errors/AppError";
import Contact from "../../models/Contact";
import ContactCustomField from "../../models/ContactCustomField";
import { WebhookService } from "../webhookService";

interface ExtraInfo extends ContactCustomField {
  name: string;
  value: string;
}

interface Request {
  name: string;
  number: string;
  email?: string;
  profilePicUrl?: string;
  companyId: number;
  extraInfo?: ExtraInfo[];
  disableBot?: boolean;
  language?: string;
}

const CreateContactService = async ({
  name,
  number,
  email = "",
  companyId,
  extraInfo = [],
  disableBot = false,
  language
}: Request): Promise<Contact> => {
  const numberExists = await Contact.findOne({
    where: { number, companyId }
  });

  if (numberExists) {
    throw new AppError("ERR_DUPLICATED_CONTACT");
  }

  const contact = await Contact.create(
    {
      name,
      number,
      email,
      extraInfo,
      companyId,
      disableBot,
      language
    },
    {
      include: ["extraInfo"]
    }
  );

  await contact.reload({
    include: ["tags", "extraInfo"]
  });

  // Enviar webhook para n8n
  try {
    await WebhookService.getInstance().contactCreated(contact);
  } catch (error) {
    console.error('Error sending webhook for contact creation:', error);
  }

  return contact;
};

export default CreateContactService;
