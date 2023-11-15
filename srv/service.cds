using  db  as db from '../db/d-esg-param';
using  app.interactions  as app from '../db/d-esg-param';

service GraphService { 
    entity ESGParameter as projection on db.ESG_Parameter;
    @cds.persistence.exists
    entity CLIENT_VIEW as projection on db.CLIENT_VIEW;

    entity ESGMeasureMaster as projection on app.ESG_MEASURE_MASTER;
    action upsertESGParameter(aParameter: array of ESGParameter, aNewClient: array of CLIENT_VIEW);
    function getClient() returns array of CLIENT_VIEW;
    function getMeasureMaster() returns array of ESGMeasureMaster;
}