Polymer({
  is: 'omi-message',

  properties: {
  },

  send(method: string, request: string, params?: any): Promise<OmiObject[]> {
    let ironRequest: any = document.createElement('iron-request');

    let requestOptions = {
      url: 'https://otaniemi3d.cs.hut.fi/omi/node/',
      method: 'POST',
      body: this._createOmiRequest(request, method, params),
      handleAs: 'xml',
      headers: {
        'Content-Type': 'text/xml'
      }
    };

    this.fire('omi-request', {
      request: ironRequest,
      options: requestOptions
    }, {bubbles: false});

    return new Promise((resolve, reject) => {
      var a = ironRequest.send(requestOptions)
        .then((result) => {
          resolve(this._parse(result.response));
        }, (error) => {
          reject(error);
        });
    });
  },

  _parse(data) {
    console.log(data);
  },

  _createOmiRequest(request: string, method: string, params: any = {}): string {
    //Because 'ttl' is located in a different place in request XML we
    //store it in a different variable.
    let ttl = '0';
    if ('ttl' in Object.keys(params)) {
      ttl = params.ttl;
      delete params.ttl;
    }
    //This function turns object into a string with format:
    //`key1="value1" key2="value2"`
    let parseParams = (params) => {
      return Object.keys(params).reduce((previous, key) => {
        return `${previous} ${key}="${params[key]}"`;
      }, '');
    };

    return (
      `<?xml version="1.0"?>
      <omi:omiEnvelope xmlns:xs="http://www.w3.org/2001/XMLSchema-instance"
        xmlns:omi="omi.xsd" version="1.0" ttl="${ttl}">
        <omi:${method.toLowerCase()} msgformat="odf"${parseParams(params)}>
          <omi:msg>
            <Objects xmlns="odf.xsd">
              ${request}
            </Objects>
          </omi:msg>
        </omi:read>
      </omi:omiEnvelope>`);
  }
});
