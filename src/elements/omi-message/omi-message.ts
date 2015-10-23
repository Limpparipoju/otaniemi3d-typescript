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
    let root: any = data.querySelector('Objects');
    let objects = root.children;
    let parsedObjects: OmiObject[] = [];

    for (let i = 0; i < objects.length; i++) {
      parsedObjects.push(this._parseObject(objects[i]));
    }

    console.log(parsedObjects);

    return parsedObjects;
  },

  _parseObject(object: Element): OmiObject {
    let id = object.querySelector('id');
    let type = object.getAttribute('type');
    let description = object.querySelector('description');
    let infoItemCollection = object.querySelectorAll('InfoItem');
    let omiObjectCollection = object.querySelectorAll('Object');

    let infoItems: InfoItem[] = [].slice.call(infoItemCollection)
      .map((infoItem) => {
        return this._parseInfoItem(infoItem);
      });
    let omiObjects: OmiObject[] = [].slice.call(omiObjectCollection)
      .map((omiObject) => {
        return this._parseObject(omiObject);
      });

    return {
      id: id ? id.textContent : null,
      type: type,
      description: description ? description.textContent : null,
      infoItems: infoItems,
      childObjects: omiObjects
    };
  },

  _parseInfoItem(item: Element) {
    let name = item.getAttribute('name');
    let description = item.querySelector('description');
    let metaData = item.querySelector('MetaData');
    let values = item.querySelectorAll('value');

    return {
      name: name,
      description: description ? description.textContent : null,
      metaData: metaData ? this._parseMetaData(metaData): null,
      values: values ? this._parseValues(values): null
    };
  },

  _parseMetaData(metaElem: Element) {
    let infoItems = metaElem.querySelectorAll('InfoItem');

    let metaData = [].slice.call(infoItems)
      .map((infoItem) => {
        let name = infoItem.getAttribute('name');
        let value = infoItem.querySelector('value');
        return [value, name];
      });

    return metaData.reduce((previous, current) => {
      previous[current[0]] = current[1];
      return previous;
    }, {});
  },

  _parseValues(valueElems: NodeListOf<Element>) {
    let values = [].slice.call(valueElems).map((value) => {
      let dateTime = value.getAttribute('dateTime');
      let unixTime = value.getAttribute('unixTime');
      let time;

      if (dateTime) {
        time = new Date (dateTime);
      } else if (unixTime) {
        time = new Date (unixTime * 1000);
      }

      return {
        value: value.textContent,
        time: time
      }
    });

    return values;
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
