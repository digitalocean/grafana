import _ from 'lodash';

export class PostgresConfigCtrl {
  static templateUrl = 'partials/config.html';

  current: any;
  datasourceSrv: any;

  /** @ngInject **/
  constructor($scope, datasourceSrv) {
    this.datasourceSrv = datasourceSrv;
    this.current.jsonData.sslmode = this.current.jsonData.sslmode || 'verify-full';
    this.current.jsonData.postgresVersion = this.current.jsonData.postgresVersion || 903;
    this.autoDetectPostgresVersion();
  }

  autoDetectPostgresVersion() {
    if (!this.current.id) {
      return;
    }

    this.datasourceSrv
      .loadDatasource(this.current.name)
      .then(ds => {
        return ds.getVersion();
      })
      .then(version => {
        version = Number(version[0].text);
        let major = Math.trunc(version / 100);
        let minor = version % 100;
        let name = String(major);
        if (version < 1000) {
          name = String(major) + '.' + String(minor);
        }
        if (!_.find(this.postgresVersions, (p: any) => p.value === version)) {
          this.postgresVersions.push({ name: name, value: version });
        }
        this.current.jsonData.postgresVersion = version;
      });
  }

  // the value portion is derived from postgres server_version_num/100
  postgresVersions = [
    { name: '9.3', value: 903 },
    { name: '9.4', value: 904 },
    { name: '9.5', value: 905 },
    { name: '9.6', value: 906 },
    { name: '10', value: 1000 },
  ];
}
