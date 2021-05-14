'use strict';

//Components and such should use the first item in the array as the default
const bootstrapButtonStyleClasses = ['btn-primary', 'btn-secondary', 'btn-success', 'btn-danger', 'btn-warning', 'btn-info', 'btn-light', 'btn-dark', 'btn-link', 'btn-outline-primary', 'btn-outline-secondary', 'btn-outline-success', 'btn-outline-danger', 'btn-outline-warning', 'btn-outline-info', 'btn-outline-light', 'btn-outline-dark'];

const getBootstrapBreakpoint = () => {
  const windowWidth = window.innerWidth;

  if (windowWidth >= 1200) {
    return 'xl';
  } else if (windowWidth >= 992) {
    return 'lg';
  } else if (windowWidth >= 768) {
    return 'md';
  } else if (windowWidth >= 576) {
    return 'sm';
  } else if (windowWidth < 576) {
    return 'xs';
  }
};

var utilityBootstrap = {
  bootstrapButtonStyleClasses,
  getBootstrapBreakpoint
};

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

function getCjsExportFromNamespace (n) {
	return n && n['default'] || n;
}

var naturalCompareLite = createCommonjsModule(function (module) {
/*
 * @version    1.4.0
 * @date       2015-10-26
 * @stability  3 - Stable
 * @author     Lauri Rooden (https://github.com/litejs/natural-compare-lite)
 * @license    MIT License
 */
var naturalCompare = function (a, b) {
  var i,
      codeA,
      codeB = 1,
      posA = 0,
      posB = 0,
      alphabet = String.alphabet;

  function getCode(str, pos, code) {
    if (code) {
      for (i = pos; code = getCode(str, i), code < 76 && code > 65;) ++i;

      return +str.slice(pos - 1, i);
    }

    code = alphabet && alphabet.indexOf(str.charAt(pos));
    return code > -1 ? code + 76 : (code = str.charCodeAt(pos) || 0, code < 45 || code > 127) ? code : code < 46 ? 65 // -
    : code < 48 ? code - 1 : code < 58 ? code + 18 // 0-9
    : code < 65 ? code - 11 : code < 91 ? code + 11 // A-Z
    : code < 97 ? code - 37 : code < 123 ? code + 5 // a-z
    : code - 63;
  }

  if ((a += "") != (b += "")) for (; codeB;) {
    codeA = getCode(a, posA++);
    codeB = getCode(b, posB++);

    if (codeA < 76 && codeB < 76 && codeA > 66 && codeB > 66) {
      codeA = getCode(a, posA, posA);
      codeB = getCode(b, posB, posA = i);
      posB = i;
    }

    if (codeA != codeB) return codeA < codeB ? -1 : 1;
  }
  return 0;
};

try {
  module.exports = naturalCompare;
} catch (e) {
  String.naturalCompare = naturalCompare;
}
});

function without(object, ...keys) {
  return Object.entries(object).filter(([key]) => keys.indexOf(key) === -1).reduce((acc, [key, value]) => {
    acc[key] = value;
    return acc;
  }, Object.create(null));
}

function groupItemsByObjectProperty(items, idKeyName) {
  let groupedItems = {};
  items.forEach(item => {
    const newItemObject = without(item, idKeyName);
    const id = Object.keys(groupedItems).find(id => parseInt(id, 10) === item[idKeyName]);

    if (id) {
      const entireArray = groupedItems[id].concat([newItemObject]);
      groupedItems = Object.assign({}, groupedItems, {
        [id]: entireArray
      });
    } else {
      groupedItems = Object.assign({}, groupedItems, {
        [item[idKeyName]]: [newItemObject]
      });
    }
  });
  return groupedItems;
}

function replaceObjectOrConcat({
  array,
  compareKey,
  object
}) {
  let found = false;
  array = array.map(item => {
    if (item[compareKey] === object[compareKey]) {
      found = true;
      return object;
    }

    return item;
  });
  return found ? array : array.concat(object);
}

function getValueByObjectKey({
  array,
  keyToMatch,
  matchValue,
  returnProperty
}) {
  if (array && array.length > 0) {
    const found = array.find(item => item[keyToMatch] === matchValue);

    if (found) {
      return found[returnProperty];
    }

    return undefined;
  }

  return undefined;
}

function toggleInclusion(array, value) {
  if (array.indexOf(value) > -1) {
    return array.reduce((sum, item) => {
      return item === value ? sum : sum.concat(item);
    }, []);
  }

  return array.concat(value);
}

function firstOr(array, or = null) {
  if (Array.isArray(array) && array.length > 0) {
    return array[0];
  }

  return or;
}

function sortArrayByObjectKey({
  array,
  key
}) {
  function sort(a, b) {
    const nameA = typeof a[key] === 'string' ? a[key].toUpperCase() : a[key];
    const nameB = typeof b[key] === 'string' ? b[key].toUpperCase() : b[key];

    if (nameA < nameB) {
      return -1;
    }

    if (nameA > nameB) {
      return 1;
    }

    return 0;
  }

  return array.slice().sort(sort);
}

function alphaNumSort(a, b, sortProp, sortDirection = 'ASC') {
  const compareResults = naturalCompareLite(a[sortProp], b[sortProp]);
  return sortDirection === 'ASC' ? compareResults : compareResults * -1;
}

function reduceToTruthyProperties({
  array,
  key,
  returnFullObject = false,
  returnFalseIfEmpty = true
}) {
  if (!Array.isArray(array)) {
    array = [];
  }

  const newArray = array.reduce((sum, item) => {
    const value = returnFullObject ? item : item[key];
    return item[key] ? sum.concat(value) : sum;
  }, []);
  return returnFalseIfEmpty && newArray.length === 0 ? false : newArray;
}

function getDistinctArrayValues(array) {
  return Array.from(new Set(array));
}

function setUuidFromIndex(array) {
  return array.map((item, index) => Object.assign({}, item, {
    uuid: index
  }));
}

function concatStringsIfTruthy({
  array,
  separator = ' '
}) {
  if (array && Array.isArray(array) && array.length > 0 && array.every(val => typeof val === 'string')) {
    return array.filter(string => string).join(separator);
  }

  return '';
}

function splitArray({
  array,
  test
}) {
  let pass = [];
  let fail = [];
  array.forEach(item => {
    const passedTest = test(item);

    if (passedTest) {
      pass.push(item);
    } else {
      fail.push(item);
    }
  });
  return {
    pass,
    fail
  };
}

function joinWithConjunction(array, options = {}) {
  if (array.length === 0) {
    return '';
  }

  if (array.length === 1) {
    return array[0];
  }

  options = {
    separator: ', ',
    conjunction: '& ',
    oxfordComma: true,
    ...options
  };

  if (!options.conjunction) {
    return array.join(options.separator);
  }

  const beginning = array.slice(0, array.length - 1).join(options.separator);
  return `${beginning}${options.oxfordComma ? options.separator : ' '}${options.conjunction}${array[array.length - 1]}`;
}

var utilityArray = {
  without,
  toggleInclusion,
  replaceObjectOrConcat,
  groupItemsByObjectProperty,
  getValueByObjectKey,
  getDistinctArrayValues,
  setUuidFromIndex,
  reduceToTruthyProperties,
  sortArrayByObjectKey,
  concatStringsIfTruthy,
  alphaNumSort,
  firstOr,
  splitArray,
  joinWithConjunction
};

var index = "{{#if href}}\n<a\n\tid=\"{{id}}\"\n\trole=\"button\"\n\tstyle=\"{{style}} {{#if disabled}} cursor: not-allowed; color: white;{{/if}}\"\n\ton-click=\"click\"\n\ttitle=\"{{title}}\"\n\tclass=\"btn {{computedClass}} {{bootstrapButtonSizeClass}}\"\n\t{{#if target}}\n\ttarget=\"{{target}}\"\n\t{{/if}}\n\t{{#if !disabled}}\n\thref=\"{{href}}\"\n\t{{/if}}\n\t{{#if download}}\n\tdownload=\"{{download}}\"\n\t{{/if}}\n>\n\t{{>buttonContents}}\n</a>\n{{else}}\n<button\n\t{{#if id}}\n\tid=\"{{id}}\"\n\t{{/if}}\n\tstyle=\"{{style}}\"\n\ton-click=\"click\"\n\ttype=\"{{type}}\"\n\ttitle=\"{{title}}\"\n\tclass=\"btn {{computedClass}} {{bootstrapButtonSizeClass}}\"\n\tdisabled=\"{{disabled}}\"\n\t{{yield extra-attributes}}\n>\n\t{{>buttonContents}}\n</button>\n{{/if}}\n\n{{#partial buttonContents}}\n{{#if iconClass}}\n<i\n\tstyle=\"{{iconStyle}} {{#if iconColor && !disabled}} color: {{iconColor}};{{/if}}\"\n\tclass=\"fas fa-fw {{iconClass}} mr-1\"\n\taria-hidden=\"true\"\n></i>\n{{/if}}\n<span class=\"{{textClass}}\">{{yield}}</span>\n{{/partial}}";

var button = /*#__PURE__*/Object.freeze({
	__proto__: null,
	'default': index
});

var require$$2 = getCjsExportFromNamespace(button);

const {
  bootstrapButtonStyleClasses: bootstrapButtonStyleClasses$1
} = utilityBootstrap;

const {
  splitArray: splitArray$1
} = utilityArray;

var button$1 = function createButtonComponent() {
  return Ractive.extend({
    template: require$$2,

    data() {
      return {
        class: '',
        id: '',
        textClass: null,
        style: null,
        bootstrapButtonSizeClass: null,
        iconClass: null,
        iconColor: null,
        iconStyle: null,
        disabled: false,
        type: 'button',
        colorGreyDisabled: true,
        download: false,
        href: ''
      };
    },

    attributes: {
      required: [],
      optional: ['class', 'id', 'textClass', 'style', 'bootstrapButtonSizeClass', 'iconClass', 'iconColor', 'iconStyle', 'disabled', 'type', 'colorGreyDisabled', 'download', 'href']
    },
    computed: {
      computedClass() {
        const givenClasses = this.get('class').split(' ');
        const {
          fail: bootstrapButtonClass,
          pass: classes
        } = splitArray$1({
          array: givenClasses,
          test: theClass => !bootstrapButtonStyleClasses$1.includes(theClass)
        });

        if (this.get('disabled')) {
          classes.push('disabled');
        }

        if (this.get('disabled') && this.get('colorGreyDisabled')) {
          classes.push('btn-secondary');
        } else if (bootstrapButtonClass.length > 0) {
          classes.push(bootstrapButtonClass[0]);
        } else {
          classes.push(bootstrapButtonStyleClasses$1[0]);
        }

        return classes.join(' ');
      }

    }
  });
};

var client = "<div class=\"container-fluid\">\r\n\t<div class=\"card\">\r\n\t\t<label for=\"table\">Choose table</label>\r\n\t\t<select class=\"form-control\" id=\"tableName\" value=\"{{ selectedTable }}\">\r\n\t\t\t<option value=\"\">Select Table</option>\r\n\t\t\t{{ #htpTables }}\r\n\t\t\t<option value=\"{{ this }}\">{{ this.table }}</option>\r\n\t\t\t{{ /htpTables }}\r\n\t\t</select>\r\n\t</div>\r\n\t<!-- <div class=\"form-group\">\r\n\t\t{{ #tableColumns: num }}\r\n\t\t<label for=\"inputBox\">{{ tableColumns[num].name }}</label>\r\n\t\t<input type=\"text\" value=\"{{ tableColumns[num].columnValue }}\" class=\"form-control\">\r\n\t\t{{ /tableColumns }}\r\n\t</div> -->\r\n\t<!-- <div class=\"form-group\">\r\n\t\t{{ #tableColumns: num }}\r\n\t\t<label for=\"inputBox\">{{ tableColumns[num] }}</label>\r\n\t\t<input type=\"text\" value=\"{{ columnValue }}\" class=\"form-control\">\r\n\t\t{{ /tableColumns }}\r\n\t</div> -->\r\n\t<!-- <div>\r\n\t\t<itButton class=\"btn-sm\" on-click=\"@this.getRows()\">Get Rows</itButton>\r\n\t</div> -->\r\n\t<div class=\"form-group\">\r\n\t\t{{ #tableColumns: num }}\r\n\t\t<label for=\"inputBox\">{{ tableColumns[num] }}</label>\r\n\t\t<!-- how do we name the value? -->\r\n\t\t<!-- <input type=\"text\" value=\"{{ columnValue }}\" class=\"form-control\"> -->\r\n\t\t{{#fieldValues}}\r\n\t\t<input class=\"form-control\" value=\"{{this}}\" />\r\n\t\t{{/fieldValues}}\r\n\t\t{{ /tableColumns }}\r\n\t</div>\r\n\t<!-- <div>\r\n\t\t{{#each tableColumns}}\r\n\t\t<label>{{@key}}</label>\r\n\t\t<input class=\"form-control\" value=\"{{.}}\" />\r\n\t\t{{/each}}\r\n\t</div> -->\r\n\r\n\t<div>\r\n\t\t<itButton class=\"btn-sm\" on-click=\"@this.getRows()\">Get Rows</itButton>\r\n\t</div>\r\n\t<div class=\"textArea\">\r\n\t\t<div>\r\n\t\t\t<span>Replikwando Row</span>\r\n\t\t\t<textarea name=\"\" id=\"leftTextArea\" cols=\"30\"\r\n\t\t\t\trows=\"40\">{{ JSON.stringify(replikwandoRow, null, 2) }}</textarea>\r\n\t\t</div>\r\n\t\t<div>\r\n\t\t\t<span>Aggregator Row</span>\r\n\t\t\t<textarea name=\"\" id=\"centerTextArea\" cols=\"30\"\r\n\t\t\t\trows=\"40\">{{ JSON.stringify(aggregatorRow, null, 2) }}</textarea>\r\n\t\t</div>\r\n\t\t<div>\r\n\t\t\t<span>Aggregator Row Difference</span>\r\n\t\t\t<textarea name=\"\" id=\"rightTextArea\" cols=\"30\"\r\n\t\t\t\trows=\"40\">{{ JSON.stringify(differenceRow, null, 2) }}</textarea>\r\n\t\t</div>\r\n\t</div>\r\n</div>";

var client$1 = /*#__PURE__*/Object.freeze({
	__proto__: null,
	'default': client
});

var require$$0 = getCjsExportFromNamespace(client$1);

/* global Ractive:readonly */


new Ractive({
  target: 'body',
  template: require$$0,
  data: {
    // msg: {
    // 	signupdate: null,
    // 	vendor_factor: 99,
    // 	system_factor: 0.99,
    // },
    aggregatorRow: '',
    replikwandoRow: '',
    differenceRow: '',
    //columnValue: [],
    htpTables: [// {
    // 	table: "companyinfo",
    // 	columns: {
    // 		"store": '',
    // 		"productcode": '',
    // 	},
    // },
    {
      table: "companyinfo",
      columns: ["productcode", "store"]
    }, {
      table: "inventory",
      columns: ["productcode", "store", "partnum"]
    }, {
      table: "invmaster",
      columns: ["productcode", "stocknum", "store"]
    }, {
      table: "mnfcrmod",
      columns: ["productcode", "typenum", "pmodel", "htpmnfcrmodid"]
    }, {
      table: "model",
      columns: ["productcode", "Model", "htpmodelid"]
    }, {
      table: "partuse",
      columns: ["productcode", "typenum"]
    }, {
      table: "partlistauthoritymap",
      columns: ["productcode", "sourceid"]
    }]
  },
  components: {
    itButton: button$1()
  },
  computed: {
    tableColumns() {
      const selectedTable = this.get('selectedTable');
      const tables = this.get('htpTables');

      if (selectedTable) {
        const matchingTable = tables.find(table => table.table === selectedTable.table); //return (matchingTable && matchingTable.columns) || []

        return matchingTable.columns || [];
      }

      return [];
    }

  },

  oninit() {
    const ractive = this;
    ractive.observe('selectedTable', table => {
      console.log('selected table: ', table);
      ractive.getColumns(table);
    }); // Loads a test row
    //ractive.loadReplikwandoRow()

    ractive.observe('tableColumns', tableColumns => {
      //the table columns have changed,
      //come up with default values for the columns
      const fieldValues = tableColumns.reduce((sum, column) => {
        return { ...sum,
          [column]: ''
        };
      }, {});
      console.log("field values: ", fieldValues);
      ractive.set({
        fieldValues
      });
    });
  },

  getColumns(table) {
    console.log("columns: ", table.columns);
    return table.columns;
  },

  getRows() {
    // const test = this.get('columnValue')
    // get the table and find the matching columns
    // try to run a get on the value for each of the columns
    // log the result
    // run a fetch
    const stuff = this.get('tableColumns');
  },

  doFetchAndSet(endPoint, attributeName) {
    return doFetch(endPoint).then(res => {
      if (res) {
        console.log("do fetch and set res: ", res);
        this.set({
          replikwandoRow: res.replikwando
        });
        this.set({
          aggregatorRow: res.aggregator
        });
        this.set({
          differenceRow: res.difference
        });
      }
    });
  },

  doFetchAndSetComparison(endPoint) {
    return doFetchComparison(endPoint).then(res => {
      if (res) {
        console.log(res);
      }
    });
  },

  loadReplikwandoRow() {
    this.doFetchAndSet('get-companyinfo', 'replikwandoRow');
  },

  loadComparisonRows() {
    this.doFetchAndSetComparison('get-companyinfo');
  }

});

async function doFetch(endPoint, data = {}) {
  const res = await fetch(endPoint, data);
  console.log("fetch response: ", res);
  const json = await res.json();
  return json;
}

async function doFetchComparison(endPoint, data = {}) {
  const res = await fetch(endPoint, data);
  const json = await res.json();
  return json;
}
//# sourceMappingURL=build.js.map
