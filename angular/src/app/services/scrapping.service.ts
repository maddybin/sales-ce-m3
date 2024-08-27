import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TOKEN } from '../providers/tab.provider';
import { Company } from '../shared/models/company.model';
import { UtilityService } from './utility.service';

@Injectable({
  providedIn: 'root'
})
export class ScrappingService {

  constructor(private utilityService: UtilityService, private http: HttpClient, @Inject(TOKEN) readonly token: any) { }

  parsePositionBasicLi(fullPosition: any, totalPositions: any) {
    let position = {};
    position['title'] = (fullPosition.title);
    position['summary'] = fullPosition.description ? (fullPosition.description) : '';
    position['company'] = fullPosition.companyName ? (fullPosition.companyName) : '';
    let companyId = fullPosition.companyUrn ? (fullPosition.companyUrn.match(/urn:li:fsd_company:(.*)/) || [])[1] : null;

    if (companyId) {
      position['company_linkedin_url'] = `www.linkedin.com/company/${companyId}`;
      position['li_company_id'] = companyId;
    }

    if (fullPosition.company && fullPosition.company.logo && fullPosition.company.logo.vectorImage &&
      fullPosition.company.logo.vectorImage.rootUrl && fullPosition.company.logo.vectorImage.artifacts.length) {
      let rootUrl = fullPosition.company.logo.vectorImage.rootUrl;
      let logoObject = fullPosition.company.logo.vectorImage.artifacts[1].fileIdentifyingUrlPathSegment;
      position['company_logo_url'] = `${rootUrl}${logoObject}`;
    }

    if (fullPosition.entityUrn) {
      position['posId'] = (fullPosition.entityUrn.match(/(,[0-9]+)/g))[0].replace(',', '');
    }

    if (fullPosition.dateRange && fullPosition.dateRange.start) {
      position['start_date'] = `${fullPosition.dateRange.start.year}-${fullPosition.dateRange.start.month || 1}-01`;
    }

    if (fullPosition.dateRange && fullPosition.dateRange.end) {
      position['end_date'] = `${fullPosition.dateRange.end.year}-${fullPosition.dateRange.end.month || 1}-01`;
    }
    position['is_current'] = !position['end_date'];
    position['li_order'] = totalPositions + 1;
    return position;
  }

  extractBasicLiContactInfoFromJson(rootNode: any) {
    let params = { basic_info: [{}] };
    var profileJson = rootNode.elements && rootNode.elements.length ? rootNode.elements[0] : null;
    let clientPageInstance = document;

    if (profileJson) {
      let first_name = profileJson.firstName ? (profileJson.firstName) : '';
      let last_name = profileJson.lastName ? (profileJson.lastName) : '';
      params.basic_info[0]['first_name'] = first_name;
      params.basic_info[0]['last_name'] = last_name;
      params.basic_info[0]['name'] = `${first_name} ${last_name}`;
      params.basic_info[0]['headline'] = profileJson.headline ? (profileJson.headline) : '';

      if (profileJson.location && profileJson.location.countryCode) {
        params.basic_info[0]['country_code'] = profileJson.location.countryCode;
      }

      if (profileJson.geoLocation && profileJson.geoLocation.geo && profileJson.geoLocation.geo.defaultLocalizedName) {
        params.basic_info[0]['location'] = profileJson.geoLocation.geo.defaultLocalizedName;
      }

      if (profileJson.industry && profileJson.industry.name) {
        params.basic_info[0]['industry'] = profileJson.industry.name || '';
      }

      params.basic_info[0]['li_guid'] = profileJson.entityUrn ? (profileJson.entityUrn.match(/urn:li:fsd_profile:(.*)/) || [])[1] : '';
      params['summary'] = profileJson.summary ? [(profileJson.summary)] : '';

      if (profileJson.objectUrn.match(/urn:li:member:(.*)/).length) {
        params.basic_info[0]['li_member_id'] = profileJson.objectUrn.match(/urn:li:member:(.*)/)[1];
      } else {
        // { callback({ isIncompleteProfile: true }); return; 
      }

      let publicIdentifier = profileJson.publicIdentifier || null;
      if (publicIdentifier) {
        params.basic_info[0]['public_identifier'] = profileJson.publicIdentifier;
        params['linkedin_url'] = `https:/\/www.linkedin.com/in/${profileJson.publicIdentifier}`;
      } else {
        // callback({ isInvalidUrl: true }); return;
      }

      if (profileJson.profilePicture) {
        var vector = profileJson?.profilePicture?.displayImageReference?.vectorImage;
        if (vector) {
          var imageUrl = vector.rootUrl + vector.artifacts[0].fileIdentifyingUrlPathSegment;
          params.basic_info[0]['image_url'] = (imageUrl);
        }
      }

      if (profileJson.profileLanguages && profileJson.profileLanguages.elements.length) {
        params['languages'] = profileJson.profileLanguages.elements.map(function (language) { return (language.name) });
      }

      let isFetchMoreSkills = false;
      if (profileJson.profileSkills && profileJson.profileSkills.elements.length) {
        let skillsArray = profileJson.profileSkills.elements || [];
        params['skills'] = [skillsArray.map(function (skill: any) { return (skill.name); })];

        let totalSkills = profileJson.profileSkills.paging && profileJson.profileSkills.paging.total ?
          profileJson.profileSkills.paging.total : profileJson.profileSkills.elements.length;
        isFetchMoreSkills = totalSkills > profileJson.profileSkills.elements.length;
      }

      let fetchMorePositions = false;
      if (profileJson.profilePositionGroups && profileJson.profilePositionGroups.elements && profileJson.profilePositionGroups.elements.length) {
        let fetchAllPosition = [];
        profileJson.profilePositionGroups.elements.forEach(post => {
          let innerGroup = post.profilePositionInPositionGroup.elements;
          if (innerGroup.length > 1) {
            innerGroup.forEach((inner: any) => {
              inner.company_name = post.companyName;
              fetchAllPosition.push(inner);
            })
          } else {
            innerGroup[0].company_name = post.companyName;
            fetchAllPosition.push(innerGroup[0]);
          }
        })

        let positions = fetchAllPosition;
        params['positions'] = [];

        for (let i = 0; i < positions.length; i++) {
          let position = this.parsePositionBasicLi(positions[i], params['positions'].length);
          if (position['posId']) { params['positions'].push(position); }
        }

        let totalNumberOfPositions = profileJson.profilePositionGroups && profileJson.profilePositionGroups.paging ? profileJson.profilePositionGroups.paging.total : 0;

        if (totalNumberOfPositions > params['positions'].length) {
          fetchMorePositions = true;
        }
      }

      return params;
    } else {
      return params;
    }
  }

  extractBasicLiCompanyInfoFromJson(profileJson: any) {
    if (profileJson && profileJson.elements && profileJson.elements.length) {
      let apiData = profileJson.elements[0];
      let info: Company = new Company;

      info.name = apiData.name ? this.decodeAmp(apiData.name) : '';
      info.website = apiData.companyPageUrl || '';
      info.description = apiData.description ? this.decodeAmp(apiData.description) : '';
      info.li_company_id = apiData.entityUrn.match(/\d+/)[0];
      info.linkedin_url_with_name = this.sanitizeLIUrl(apiData.url);
      info.specialties = this.decodeAmp((apiData.specialities || []).join());
      info.li_slug = apiData.universalName;
      info.employees = apiData.staffCount;
      info.employee_on_linkedin = apiData.staffCount;

      if (info.li_company_id) {
        info.linkedin_url = `https://www.linkedin.com/company/${info.li_company_id}/`
      } else {
        info.linkedin_url = this.sanitizeLIUrl(apiData.url);
      }

      if (apiData.followingInfo && apiData.followingInfo.followerCount) {
        info.followers = apiData.followingInfo.followerCount;
      }

      if (apiData.companyIndustries && apiData.companyIndustries.length) {
        info.industry = apiData.companyIndustries[0].localizedName;
      }

      if (apiData.companyType && apiData.companyType.localizedName) {
        info.type = apiData.companyType.localizedName;
      }

      if (apiData.headquarter) {
        info.address1 = this.decodeAmp(apiData.headquarter.line1);
        info.city = this.decodeAmp(apiData.headquarter.city);
        info.region = this.decodeAmp(apiData.headquarter.geographicArea);
        info.pin_code = this.decodeAmp(apiData.headquarter.postalCode);
        info.country = this.decodeAmp(apiData.headquarter.country);
      }

      let logoObject = apiData.logo && apiData.logo.image ? apiData.logo.image['com.linkedin.common.VectorImage'] : null;

      if (logoObject && logoObject.rootUrl && logoObject.artifacts && logoObject.artifacts.length) {
        info.logo_url = `${logoObject.rootUrl}${logoObject.artifacts[1].fileIdentifyingUrlPathSegment}`;
      }

      let range = apiData.staffCountRange;
      if (range && range.start && range.end) {
        info.employee_range_on_linkedin = { low: range.start, high: range.end }
      } else if (range && range.start) {
        info.employee_range_on_linkedin = { low: range.start, high: range.start }
      }


      if (apiData.foundedOn && apiData.foundedOn.year) {
        info.founded = this.utilityService.formatDate(apiData.foundedOn.year.toString());
      }

      if (apiData.fundingData && apiData.fundingData.companyCrunchbaseUrl) {
        let cbUrl = apiData.fundingData.companyCrunchbaseUrl;
        if (cbUrl && cbUrl.split('?').length > 1) {
          info.crunchbase_url_from_li = cbUrl.split('?')[0];
        }
      }

      return { default: [info] };
    } else {
      return null;
    }

  }

  fetchBasicLiContactDetails(payload: any): Observable<any> {
    let contactBasicApiParams = "&decorationId=com.linkedin.voyager.dash.deco.identity.profile.FullProfileWithEntities-73";
    let contactBasicApiUrl = "https://www.linkedin.com/voyager/api/identity/dash/profiles?q=memberIdentity&memberIdentity=";
    let memberIdentity = this.utilityService.extractMemberIdentity(payload.linkedin_url, '/in/');
    var apiUrl = `${contactBasicApiUrl}${encodeURIComponent(memberIdentity)}${contactBasicApiParams}`

    const headers = new HttpHeaders({
      'Accept': 'application/json, */*; q=0.01',
      'Csrf-Token': JSON.stringify(this.token).replace(/\"/g, '').replace(/\\/g, ''),
      'x-li-lang': 'en_US',
      'x-li-page-instance': document.toString(),
      'x-requested-with': 'XMLHttpRequest',
      'x-restli-protocol-version': '2.0.0',
      'content-type': 'application/json'
    });
    return this.http.get(apiUrl, { headers: headers });
  }

  fetchBasicLiCompanyDetails(payload: any): Observable<any> {
    let companyBasicApiUrl = "https://www.linkedin.com/voyager/api/organization/companies?decorationId=com.linkedin.voyager.deco.organization.web.WebFullCompanyMain-33";
    let companyBasicApiParams = "&q=universalName&universalName=";
    let memberIdentity = this.utilityService.extractMemberIdentity(payload.linkedin_url, '/company/');

    var apiUrl = `${companyBasicApiUrl}${companyBasicApiParams}${memberIdentity}`

    const headers = new HttpHeaders({
      'Accept': 'application/json, */*; q=0.01',
      'Csrf-Token': JSON.stringify(this.token).replace(/\"/g, '').replace(/\\/g, ''),
      'x-li-lang': 'en_US',
      'x-li-page-instance': document.toString(),
      'x-requested-with': 'XMLHttpRequest',
      'x-restli-protocol-version': '2.0.0',
      'content-type': 'application/json'
    });

    return this.http.get(apiUrl, { headers: headers });
  }

  private decodeAmpTwice(data = "") {
    return (data || "").replace(/&amp;/g, '&');
  };

  private decodeAmp(data = "") {
    if (data.length === 1 && data[0] == "") {
      data = "";
    }
    return this.decodeAmpTwice((data || "").replace(/&amp;/g, '&'));
  };

  private sanitizeLIUrl(url: any) {
    if (url) {
      var split_token = 'linkedin.com';
      var li_slug = url.split(split_token)[1];
      if (li_slug) {
        url = 'https://www.' + split_token + li_slug;
        return url;
      } else {
        return url;
      }
    } else {
      return null;
    }
  };

} 
