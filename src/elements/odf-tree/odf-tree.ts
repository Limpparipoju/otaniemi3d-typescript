Polymer({
  is: 'odf-tree',

  properties: {
    building: String
  },

  attached() {
    let omiNode = <OmiMessageElement>document.createElement('omi-message');

    let dataRequest = omiNode.send('read', `
      <Object>
        <id>${this.building}</id>
      <Object>
    `);
    /*
    return request.send('read', `
      <Object>
        <id>${this.building}</id>
      </Object>`
    ).then((data) => {
      floorPlan.sensorData = data[0].childObjects;
      return floorPlan;
    });*/

    $(this.root).jstree({
      plugins: [
        'sort',
        'checkbox',
        'search'
      ],
      search: {
        show_only_matches: true,
        show_only_matches_children: true
      },
      themes: {
        responsive: true
      },
      core: {
        data: (node: OdfTreeNode, callback: Function) => {
          if (node.id === '#') {
            dataRequest.then((data) => {
              let children = (<any[]>data[0].childObjects).concat(data[0].infoItems);

              callback(children.map((object): OdfTreeNode => {
                return {
                  id: object.id,
                  text: object.id,
                  children: (!!object.infoItems || !!object.childObjects),
                  object: object
                };
              }));
            });
          } else if (node.orginal.object) {
            dataRequest.then((data) => {
              callback(data[0].childObjects.map((object): OdfTreeNode => {
                return {
                  id: `id_${object.id}`,
                  text: object.id,
                  children: (!!object.infoItems || !!object.childObjects),
                  object: object
                };
              }));
            });
          }
        }
      }
    });
  },

  odfTreeFormat(odfObject: OdfObject): OdfTreeNode {
    return;
  }
});
