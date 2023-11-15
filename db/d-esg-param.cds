using {managed} from '@sap/cds/common';


entity db.ESG_Parameter : managed {
    key category    : String(1);
        usage_flag  : String(1);
        objective1  : String;
        objective2  : String;
        subjective1 : String;
        logarithm   : String(1);
        rugsub      : String;
        subjective2 : String;
        client      : String;
        client_item : String;
        pValue      : Decimal(31, 14);
        year        : Integer;
}


entity app.interactions.ESG_MEASURE_MASTER {

    key var               : String(100);
        var_name          : String(500);
        var_no            : Integer;
        var_itm_no        : Integer;
        var_itm_name      : String(500);
        direction         : String(1);
        excl_flag         : String(1);
        maj_class         : String(500);
        min_class         : String(500);
        sct_entity        : String(100);
        measure_id        : String(100);
        dim_id            : String(100);
        dim_val           : String(1000);
        ds_sct            : String(500);
        ds_manual         : String(500);
        stagg_year_matrix : Integer;
        stagg_year_vrc    : Integer;
        flag_matrix       : String(1);
        flag_vrc          : String(1);
        period_start      : String(100);
        period_end        : String(100);


};

@cds.persistence.exists
entity db.CLIENT_VIEW {
    key CLIENTKEY   : String(50) @title: 'CLIENT';
    key CLIENT_ITEM : String(50) @title: 'CLIENT ITEM';
        TITLE       : String(50) @title: 'TITLE';
        MATRIX      : String(1)  @title: 'MATRIX ACTIVATION';
        CHART       : String(1)  @title: 'CHART ACTIVATION';
};
