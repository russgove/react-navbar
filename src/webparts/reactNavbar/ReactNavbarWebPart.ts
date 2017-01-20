import * as React from 'react';
import * as ReactDom from 'react-dom';
import * as pnp from 'sp-pnp-js';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';
import { IContextualMenuItem} from 'office-ui-fabric-react';
import * as strings from 'reactNavbarStrings';
import ReactNavbar from './components/ReactNavbar';
import { IReactNavbarProps } from './components/IReactNavbarProps';
import { IReactNavbarWebPartProps } from './IReactNavbarWebPartProps';

export default class ReactNavbarWebPart extends BaseClientSideWebPart<IReactNavbarWebPartProps> {

  private NavBar: React.ReactElement<IReactNavbarProps>;
  /* gets a property from an item in the seacrh results */
  public getProperty(site, propertyName) {
    for (const cell of site.Cells) {
      if (cell.Key === propertyName) {
        return cell.Value;
      }
    }
  };
  /* create update global Nav witgh the search results */
  private findSubWebsForWeb(sites: Array<pnp.SearchResult>, parentLink): Array<IContextualMenuItem> {
    return sites.filter((site: pnp.SearchResult) => {
      const thisParent = this.getProperty(site, "ParentLink");
      return (thisParent === parentLink);
    }).map((node: pnp.SearchResult) => {
      return {
        key: this.getProperty(node, "Path"),
        href: this.getProperty(node, "Path"),
        name: this.getProperty(node, "Title"),
        title: this.getProperty(node, "Description"),
        parentId: parentLink,
       // altText: this.getProperty(node, "Description")
      };
    });
  };
  /* fill in child ndes for a site */
  private fillSubsites = function (sites: pnp.SearchResults, site: IContextualMenuItem, level: number) {
    const subsites = this.findSubWebsForWeb(sites, site.href);
    if (subsites.length > 0) { // dont pass empty array, makes th eparent not clickable
      site.items = subsites;
      for (const subweb of site.items) {
        this.fillSubsites(sites, subweb, level + 1);
      }
    }
  };
  public convertsitesToTree(sites): Array<IContextualMenuItem> {
    const rootNodes = this.findSubWebsForWeb(sites, this.context.pageContext.site.absoluteUrl);
    for (const rootNode of rootNodes) {
      this.fillSubsites(sites, rootNode, 1);
    }
    return rootNodes;
  }
  public getNavNodes(): Promise<Array<IContextualMenuItem>> {
    const root = this.context.pageContext.site.absoluteUrl;
    // const queryText = "'contentClass=\"STS_Web\"+path:" + root + "'&trimduplicates=false&rowlimit=300&selectProperties='Title,Path,Description,ParentLink'&SortList='refinablestring00:ascending'";
    const query: pnp.SearchQuery = {
      "Querytext": "contentClass=\"STS_Web\"+path:\"" + root + "\"",
      "TrimDuplicates": false,
      "RowLimit": 300,
      "SelectProperties": [
        "Title", "Path", "Description", "ParentLink",
      ],

      "SortList":
      [
        {
          "Property": "refinablestring00", // need to map Title to refinablestring00 and make it sortable
          "Direction": pnp.SortDirection.Ascending
        },

      ],
    };
    return pnp.sp.search(query).then(results => {
      return this.convertsitesToTree(results.RawSearchResults.PrimaryQueryResult.RelevantResults.Table.Rows);

    });
  }
  public render(): void {
    debugger;
    this.getNavNodes().then((nodes) => {
      this.NavBar = React.createElement(
        ReactNavbar,
        {
          description: this.properties.description,
          navNodes: nodes
        }
      );
      ReactDom.render(this.NavBar, this.domElement);

    });



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
