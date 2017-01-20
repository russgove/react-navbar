import * as React from 'react';
import {
  css,
  Nav, INavLink, INavLinkGroup, INavProps,
  ContextualMenu, IContextualMenuProps, IContextualMenuItem,
  CommandBar, ICommandBarProps
} from 'office-ui-fabric-react';
import styles from './ReactNavbar.module.scss';
import { IReactNavbarProps } from './IReactNavbarProps';

export default class ReactNavbar extends React.Component<IReactNavbarProps, void> {
  private groups: Array<INavLinkGroup>;
  private links: Array<INavLink>;
  private menuitems: Array<IContextualMenuItem>;
  private cbprops: ICommandBarProps;
  public render(): React.ReactElement<IReactNavbarProps> {
    this.links = [{
      name: 'Hi',
      url: 'http://www.google.com'

    }];
    this.groups = [
      {
        links: this.links
      }
    ];
    this.menuitems = [
      {
        key: "1",
        //      href: "https://tronoxglobal.sharepoint.com/teams/IT/Applications/",
        name: "Applications",
        title: "Applications",
        items: [
          {
            key: "2",
            href: 'https://tronoxglobal.sharepoint.com/teams/IT/Applications/',
            name: "Home",
            title: "App Home"
          },
          {
            key: "323",
            href: 'https://tronoxglobal.sharepoint.com/teams/IT/Applications/AlkaliSAP',
            name: "SAP",
            title: "SAO"
          },
          {
            key: "23232",
            href: 'https://tronoxglobal.sharepoint.com/teams/IT/Applications/SharePoint',
            name: "SP",
            title: "SP",
            submenuProps: {
              items: [
                {
                  key: "2",
                  href: 'https://tronoxglobal.sharepoint.com/teams/IT/Applications/SharePoint',
                  name: "Home",
                  title: "SP Home"
                },
                {
                  key: "323",
                  href: 'https://tronoxglobal.sharepoint.com/teams/IT/Applications/SharePoint/CMS%20Implementation',
                  name: "CMS",
                  title: "CMS"
                },
                {
                  key: "23232",
                  href: 'https://tronoxglobal.sharepoint.com/teams/IT/Applications/SharePoint/eDocumentSignature%20Implementation',
                  name: "edocs",
                  title: "edocs"
                },


              ]
            }
          },


        ]
      },
      {
        key: "1",
        href: "https://tronoxglobal.sharepoint.com/teams/IT/BPU/",
        name: "BPI",
        title: "BPI",
        items: [{
          key: "21",
          href: 'http://www.yahoo.com',
          name: "yahoo",
          title: "yoo hoo"
        }]
      }
      ,
      {
        key: "2",
        href: "https://tronoxglobal.sharepoint.com/teams/IT/ITCA/",
        name: "IT Contraols and ana",
        title: "IT Contraols and ana",
        items: [{
          key: "s2",
          href: 'http://www.yahoo.com',
          name: "yahoo",
          title: "yoo hoo"
        }]
      }
      ,
      {
        key: "3",
        href: "https://tronoxglobal.sharepoint.com/teams/IT/ITE/",
        name: "IT EXECUTIVE",
        title: "IT EXECUTIVE",
        items: [{
          key: "23",
          href: 'http://www.yahoo.com',
          name: "yahoo",
          title: "yoo hoo"
        }]
      }
      ,
      {
        key: "4",
        href: "https://tronoxglobal.sharepoint.com/teams/IT/IT Inentory/",
        name: "IT Ibentory",
        title: "IT Ibentory",
        items: [{
          key: "24",
          href: 'http://www.yahoo.com',
          name: "yahoo",
          title: "yoo hoo"
        }]
      }
      ,
      {
        key: "5",
        href: "https://tronoxglobal.sharepoint.com/teams/IT/Applications/",
        name: "Applications",
        title: "Applications",
        items: [{
          key: "55",
          href: 'http://www.yahoo.com',
          name: "yahoo",
          title: "yoo hoo"
        }]
      }

    ];


    return (
      <div className={styles.helloWorld}>
        <div className={styles.container}>


          <CommandBar items={this.menuitems} >
          </CommandBar>
        </div>
      </div>
    );
  }
}
