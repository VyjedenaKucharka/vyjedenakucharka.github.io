---

---
// Taken from http://katydecorah.com
// builds lunr
var index = lunr(function () {
  this.field('title')
  this.field('content', {boost: 10})
  this.field('category')
  this.ref('id')
});
{% assign count = 0 %}{% for post in site.recepty %}
index.add({
  title: {{post.title | jsonify}},
  category: {{post.category | jsonify}},
  content: {{post.content | strip_html | jsonify}},
  tags: {{post.tags | jsonify}},
  id: {{count}}
});{% assign count = count | plus: 1 %}{% endfor %}
console.log( jQuery.type(index) );
// builds reference data
var store = [{% for post in site.recepty %}{
  "title": {{ post.title | jsonify }},
  "link": {{ post.url | jsonify }},
  "category": {{ post.category | jsonify }},
  "excerpt": {{ post.content | markdownify | strip_html | truncatewords: 20 | jsonify }}
}{% unless forloop.last %},{% endunless %}{% endfor %}]
// builds search
$(document).ready(function() {
  $('input#search').on('keyup', function () {
    var resultdiv = $('#results');
    // Get query
    var query = $(this).val();
    // Search for it
    var result = index.search(query);
    // Show results
    resultdiv.empty();
    // Add status
    resultdiv.prepend('<p class="">Found '+result.length+' result(s)</p>');
    // Loop through, match, and add results
    for (var item in result) {
console.log(item);
      var ref = result[item].ref;
console.log(ref);
      var searchitem = '<div class="result"><div class="result-body"><a href="'+store[ref].link+'" class="post-title">'+store[ref].title+'</a><div class="post-date small">'+store[ref].category+' </div><p>'+store[ref].excerpt+'</p></div>';
      resultdiv.append(searchitem);
    }
  });
});
