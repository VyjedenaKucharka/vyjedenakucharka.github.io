---

---
// Taken from http://katydecorah.com
// builds lunr
var index = lunr(function () {
  this.field('title')
  this.field('content', {boost: 10})
  this.field('category')
  this.ref('id')
{% assign count = 0 %}{% for post in site.recepty %}
  this.add({
  title: {{post.title | jsonify}},
  category: {{post.category | jsonify}},
  content: {{post.content | strip_html | jsonify}},
  tags: {{post.tags | jsonify}},
  id: {{count}}
});{% assign count = count | plus: 1 %}{% endfor %}
})

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
    if (result.length == 0) {
      resultdiv.prepend('<p class="">Nenalezen žádný recept.');
    } else if (result.length == 1) {
      resultdiv.prepend('<p class="">Nalezen právě jeden recept.');
    } else if (result.length > 1 && result.length < 5) {
      resultdiv.prepend('<p class="">Nalezeny '+result.length+' recepty.');
    } else {
      resultdiv.prepend('<p class="">Nalezeno '+result.length+' receptů.');
    }
    // Loop through, match, and add results
    for (var item in result) {
      var ref = result[item].ref;
      var searchitem = '<div class="search-result"><div class="result-body"><a href="'+store[ref].link+'" class="post-title">'+store[ref].title+'</a><div class="post-date small">'+store[ref].category+' </div><p>'+store[ref].excerpt+'</p></div>';
      resultdiv.append(searchitem);
    }
  });
});
