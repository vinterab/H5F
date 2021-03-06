/*global QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/
(function() {
  var form = document.getElementById("qunit-fixture"),
    formElem = document.getElementById("other"),
    email = document.getElementById("email"),
    url = document.getElementById("url"),
    number = document.getElementById("number"),
    postcode = document.getElementById("postcode"),
    nickname = document.getElementById("nickname");
  
  test("H5F global", function() {
    ok(window.H5F, 'H5F global exists');
  });

  module("Validity API");

  test("Form element js attributes", function() {
    ok( formElem.validity, "validity attribute on form element exists" );
    
    ok( !formElem.validity.customError, "customError attribute exists" );
    ok( !formElem.validity.patternMismatch, "patternMismatch attribute exists" );
    ok( !formElem.validity.rangeOverflow, "rangeOverflow attribute exists" );
    ok( !formElem.validity.rangeUnderflow, "rangeUnderflow attribute exists" );
    ok( !formElem.validity.stepMismatch, "stepMismatch attribute exists" );
    ok( formElem.validity.valid, "valid attribute exists" );
    ok( !formElem.validity.valueMissing, "valueMissing attribute exists" );
  });
  
  module("Form validity");
  
  test("checkValidity method", function() {
    ok( form.checkValidity, "checkValidity method exists on parent form" );
    
    ok( formElem.checkValidity, "checkValidity method exists on element" );
  });
  
  module("Custom validation");
  
  function testCustomError(msg) {
    var ret;
    
    formElem.setCustomValidity(msg);
    ret = formElem.checkValidity();
    formElem.setCustomValidity("");
    return !!ret;
  }
  test("setCustomValidity and validationMessage", function() {
    ok( !formElem.validity.customError, "customError attribute is false" );
    equal( formElem.validationMessage, "", "validationMessage is empty" );
    ok( formElem.setCustomValidity, "setCustomValidity method exists" );
    equal( testCustomError("Not valid for some reason"), false, "Setting custom error message on field will always return false until the custom error is an empty string" );
  });
  
  module("Input type email and URL");
  
  function testEmail(address) {
    var ret;
    
    email.value = address;
    ret = email.checkValidity();
    email.value = "";
    
    return !!ret;
  }
  test("Email", function() {
    // A valid email varies between browsers FF4 and Opera: ry@an is valid, where as Chrome requires atleast ry@an.c
    equal( testEmail("notvalidemail"), false, "Setting email value to 'notvalidemail' is invalid" );
    equal( testEmail("ryan@awesome.com"), true, "Setting email value to h5f@awesome.com is valid" );
  });
  
  function testURL(address) {
    var ret;
    
    url.value = address;
    ret = url.checkValidity();
    url.value = "";
    
    return !!ret;
  }
  test("URL", function() {
    equal( testURL("example.com"), false, "Setting URL value to example.com is invalid" );
    equal( testURL("http://example.com"), true, "Setting URL value to http://example.com is valid" );
  });
  
  module("Input type number");
  
  function testNumber(val) {
    var ret;
    
    number.value = val;
    ret = number.checkValidity();
    number.value = "";
    
    return !!ret;
  }
  test("Number", function() {
    equal( testNumber("1122a123"), false, "Setting Number value to 1122a123 is invalid" );
    equal( testNumber("1"), true, "Setting Number value to 1 is valid" );
    equal( testNumber("12"), true, "Setting Number value to 12 is valid" );
  });
  
  module("Field attributes");
  
  function testPattern(val) {
    var ret;
    
    nickname.value = val;
    ret = nickname.checkValidity();
    nickname.value = "";
    
    return !!ret;
  }
  test("pattern", function() {
    equal( testPattern("ry"), false, "Nickname field has pattern that requires atleast 4 alphanumeric characters, only set two" );
    equal( testPattern("ryan"), true, "Set four characters on nickname field, will be valid" );
  });
  
  function testRange(val) {
    var ret;
    
    // FF4 will fail as min, max and step aren't supported, better support detection is coming!
    postcode.value = val;
    ret = postcode.checkValidity();
    postcode.value = "";
    
    return !!ret;
  }
  test("min, max and step", function() {
    equal( testRange("1000"), false, "Value of 1000 is below min attribute, 1001, and will be invalid" );
    equal( testRange("8001"), false, "Value of 8001 is above max attribute, 8000, and will be invalid" );
    equal( testRange("1002"), false, "Value is within range but does not increment by specified step attribute of 2" );
    
    equal( testRange("1003"), true, "Value is within range and adheres to the step attribute of incements of 2" );
  });
  
}());