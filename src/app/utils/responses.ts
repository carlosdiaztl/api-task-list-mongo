import { ECodeHTTPStatus } from "./enums";

export const success = (
  res: any,
  typeOrMessage: any,
  code: any,
  data: any,
  clean = false
) => {
  let message = "";

  switch (typeOrMessage) {
    case "GET":
      message = "Data get successfully";
      code = ECodeHTTPStatus.OK;
      break;
    case "FETCH":
      message = "Data fetched successfully";
      code = ECodeHTTPStatus.OK;
      break;

    case "PUT":
      message = "Data updated successfully";
      code = ECodeHTTPStatus.OK;
      break;

    case "POST":
      message = "Data created successfully";
      code = ECodeHTTPStatus.CREATED;
      break;

    case "DELETE":
      message = "Data deleted successfully";
      code = ECodeHTTPStatus.NO_CONTENT;
      break;

    case "DATA NOT FOUND":
      message = "Data not found";
      code = ECodeHTTPStatus.NOT_FOUND;
      break;

    default:
      message = typeOrMessage;
      break;
  }
  let jsonData = clean ? data : { data, message, code };
  return res.status(code).json(jsonData);
};

export const warning = (res: any, message: any, code: any, error: any) => {
  const json: any = {};
  json.message = message;
  json.error = error;
  json.data = [];
  return res.status(code).json(json);
};

export const warningHandler = (log: any) => {
  interface JSON {
    message: string;
    stack: string;
    code: number;
    data: string;
  }
  let json: JSON = {
    message: log.name + ": " + log.message,
    stack: log.stack,
    code: 500,
    data: "",
  };
  if (
    log.hasOwnProperty("response") &&
    log.response !== undefined &&
    log.response.hasOwnProperty("data") &&
    log.response.data != ""
  ) {
    let data = log.response.data;
    if (typeof data != "string") data = JSON.stringify(data);
    json.data = data;
    json.message += " \n .Error Servidor Externo: " + data;
  }
  return json;
};
export const fromStatusAndCode = async (
  res: any,
  row: any,
  action: any,
  clean?: any
) => {
  try {
    return success(res, action, row?.code ?? 200, row, clean);
  } catch (error: any) {
    return warning(res, error.message, 500, error);
  }
};