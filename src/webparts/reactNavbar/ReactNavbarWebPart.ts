import * as React from 'react';
import * as ReactDom from 'react-dom';
import * as pnp from 'sp-pnp-js';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';

import * as strings from 'reactNavbarStrings';
import ReactNavbar from './components/ReactNavbar';
import { IReactNavbarProps } from './components/IReactNavbarProps';
import { IReactNavbarWebPartProps } from './IReactNavbarWebPartProps';

export default class ReactNavbarWebPart extends BaseClientSideWebPart<IReactNavbarWebPartProps> {
  /* gets a property from an item in the seacrh results */
  public getProperty(site, propertyName) {
    for (var propidx = 0; propidx < site.Cells.results.length; propidx++) {
      if (site.Cells.results[propidx].Key === propertyName) {
        return site.Cells.results[propidx].Value
      }
    }
  };
  /* create update global Nav witgh the search results */
  private findSubWebsForWeb(sites, parentLink) {
    var subwebs = [];
    for (var subwebidx = 0; subwebidx < sites.length; subwebidx++) {
      var thisParent = this.getProperty(sites[subwebidx], "ParentLink");
      if (thisParent === parentLink) {
        subwebs.push(sites[subwebidx]);
      }
    }
    return subwebs;
  };
  /* fill in child ndes for a site */
  private fillSubsites = function (sites, site, level) {

    var siteName = this.getProperty(site, "Title");
    var siteUrl = this.getProperty(site, "Path");
    site.subwebs = this.findSubWebsForWeb(sites, siteUrl);

    for (var webidx = 0; webidx < site.subwebs.length; webidx++) {
      this.fillSubsites(sites, site.subwebs[webidx], level + 1)
    }
  };
  public convertsitesToTree(sites): any {
    const rootTree = this.findSubWebsForWeb(sites, this.context.pageContext.site.absoluteUrl);
    for (var i = 0; i < rootTree.length; i++) {
      this.fillSubsites(sites, rootTree[i], 1)
    }
    return rootTree;
  }
  public getNavNodes(): Promise<any> {
    const root = this.context.pageContext.site.absoluteUrl;
    const queryText = "'contentClass=\"STS_Web\"+path:" + root + "'&trimduplicates=false&rowlimit=300&selectProperties='Title,Path,Description,ParentLink'&SortList='refinablestring00:ascending'";
    return pnp.sp.search(queryText).then(results => {
      const tree = this.convertsitesToTree(results.RawSearchResults.PrimaryQueryResult.RelevantResults.Table.Rows.results);
      debugger;
    });
  }
  public render(): void {
    debugger;
    const navNodes = this.getNavNodes();
    const element: React.ReactElement<IReactNavbarProps> = React.createElement(
      ReactNavbar,
      {
        description: this.properties.description
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
