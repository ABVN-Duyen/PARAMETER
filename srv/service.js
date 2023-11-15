const cds = require("@sap/cds");
module.exports = cds.service.impl(async (service) => {
  const { ESGMeasureMaster, ESGParameter, CLIENT_VIEW } = service.entities;
  service.on("upsertESGParameter", async (req) => {
    const aParam = req.data.aParameter;
    const aClient = req.data.aNewClient
    //Upsert Parameter to DB
    await service.upsert(aParam).into(ESGParameter);

    // Add new client to DB_CLIENT_VIEW 
    if (aClient.length > 0) {
      await service.upsert(aClient).into(CLIENT_VIEW);
    }
  });

  service.on("getClient", async (req) => {
    let aClient = await service
      .read(CLIENT_VIEW)
      
    return aClient;
  });

  service.on("getMeasureMaster", async (req) => {
    let aMeasureMaster = await service
      .read(ESGMeasureMaster)
      .columns(["var", "var_name"]);
    console.log(aMeasureMaster);
    if (aMeasureMaster.length > 1) {
      //Get distinct measure master varname
      aMeasureMaster = aMeasureMaster.filter(
        (value, index, self) =>
          index === self.findIndex((t) => t.var_name === value.var_name && t.var === value.var)
      );
    }
    return aMeasureMaster;
  });
});
