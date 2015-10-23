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

  _parse(data: Document): OmiObject[] {
    console.log(data.querySelector('Objects'));
    let root = data.querySelector('Objects');
    let objects = root.children;
    let parsedObjects: OmiObject[] = [];

    for (let i = 0; i < objects.length; i++) {
      parsedObjects.push(this._parseObject(objects[i]));
    }

    console.log(parsedObjects);

    return parsedObjects;
  },

  _parseObject(object: Element): OmiObject {
    let children = object.children;
    let type = object.getAttribute('type');
    let id;
    let description;
    let infoItems = [];
    let omiObjects = [];

    for (let i = 0; i < children.length; i++) {
      if (children[i].nodeName === 'id') {
        id = children[i];
      } else if (children[i].nodeName === 'description') {
        description = children[i];
      } else if (children[i].nodeName === 'InfoItem') {
        infoItems.push(children[i]);
      } else if (children[i].nodeName === 'Object') {
        omiObjects.push(children[i]);
      }
    }

    return {
      id: id ? id.textContent : null,
      type: type,
      description: description ? description.textContent : null,
      infoItems: infoItems.map((item) => this._parseInfoItem(item)),
      childObjects: omiObjects.map((object) => this._parseObject(object))
    };
  },

  _parseInfoItem(item: Element) {
    let children = item.children;
    let name = item.getAttribute('name');
    let description;
    let metaData;
    let values = [];

    for (let i = 0; i < children.length; i++) {
      if (children[i].nodeName === 'description') {
        description = children[i];
      } else if (children[i].nodeName === 'MetaData') {
        metaData = children[i];
      } else if (children[i].nodeName === 'value') {
        values.push(children[i]);
      }
    }

    return {
      name: name,
      description: description ? description.textContent : null,
      metaData: metaData ? this._parseMetaData(metaData) : null,
      values: values.map((value) => this._parseValue(value)),
    };
  },

  _parseMetaData(metaElem: Element) {
    let children = metaElem.children;
    let infoItems = [];

    for (let i = 0; i < children.length; i++) {
      if (children[i].nodeName === 'InfoItem') {
        infoItems.push(children[i]);
      }
    }

    let metaData = infoItems.map((data) => this._parseInfoItem(data));

    return metaData.reduce((previous, current) => {
      if (current.values.length === 1) {
        previous[current.name] = current.values[0].value;
      } else if (current.values.length > 1) {
        previous[current.name] = current.values;
      }
      return previous;
    }, {});
  },

  _parseValue(value: Element) {
    let dateTime = value.getAttribute('dateTime');
    let unixTime = value.getAttribute('unixTime');
    let time;

    if (dateTime) {
      time = new Date (dateTime);
    } else if (unixTime) {
      time = new Date (Number(unixTime) * 1000);
    }

    return {
      value: value.textContent,
      time: time
    };
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
