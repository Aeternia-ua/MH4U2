const breadcrumbItemTemplate = `
    <div class="breadcrumbs-dropdown">
        <button class="dropbtn">
            <i class="fa fa-times-circle clearfilter"></i> <!-- //On click - clear this level -->
            {auDisplayName}
            <i class="fa fa-caret-down nextlevel"></i>
        </button>
        <div class="breadcrumbs-dropdown-content" id="{elementId}">
        </div>
    </div>
`;

const checkboxFilterItemTemplate = `
    <li>
        <div class="inputs" id="{categoryName}">
            <label class="check">{categoryItemLabel}
                <input type="checkbox" class="filtercontrol {categoryName}-check" value="{categoryItem}" name="check"> <span class="label-text checkmark"></span>
            </label>
        </div>
    </li>
`;

const sidebarTemplate =
	`<h5 class="card-header text-center">Офіційна назва</h5>
	<p class="official-name-header"> {{officialName}} </p>
	<h5 class="card-header text-center">Юридична адреса</h5> {{address}} 
	<h5 class="card-header text-center">Контакти</h5> {{phonenumber}} {{email}}
	{{filterValues}}
	<h5 class="card-header text-center">Тип послуг</h4> {{activitycategory}}: {{activitycodename}}.
    <ul class="list-group">
    <li class="list-group">{{subactivitycodename}}. </li>
    </ul></br>
	<p><small class="text-muted">Інформація актуальна станом на {{recorddate}}</small></p>`

const mh4uCooperationBadge = `<span class="badge badge-warning badge-pill"><i class="fa fa-certificate" aria-hidden="true"> Співпраця з MH4U</i></span>`;

const filterCategoryTemplate =
	`<li>
		<!-- This is the filter dropdown item template prototype START-->
		<a href="#{categoryCanonicalName}Submenu" data-toggle="collapse" aria-expanded="false" class="dropdown-toggle">
			<button type="button" id="clear{categoryCanonicalName}FiltersBtn" class="btn btn-info btn-sm clear-filter no-collapse" title="Очистити фільтр" disabled><div class="btn-clear-filter"></div></button>
			{categoryName}</a>

		<ul class="collapse list-unstyled" id="{categoryCanonicalName}Submenu">
			
			<div class="form-check">
				<!-- This is the filter dropdown item template prototype START-->
				<!-- Items will be inserted here -->
				<!-- This is the filter dropdown item template prototype END-->
			</div>
		</ul>
	</li>
`;


