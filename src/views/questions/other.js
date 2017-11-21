<ul>
  <% answers.forEach((answer) => { %>
    <li>Title: <%= answer.title %> - Body: <%= answer.body %> </li>
    <h4>Votes: <%=answer.votes_sum%></h4>
    <form action="/questions/<%=question.id%>/upvoteAnswer/<%= answer.id %>"  method="post">
      <input type="hidden" name="_method" value="patch" />
      <div>
        <input type="submit" value="Upvote Answer" />
      </div>
    </form>
    <form action="/questions/<%=question.id%>/downvoteAnswer/<%= answer.id %>" method="post">
    <input type="hidden" name="_method" value="patch" />
      <div>
        <input type="submit"  value="Downvote Answer" />
      </div>
    
  </form>
    <ul>
      <% comments.forEach((commentInfo) => {
       if (answer.id===commentInfo.answerId){%>
        <h4>Comentarios:</h4>
        <ul>
          <% commentInfo.content.forEach((comment) => { %>
          <li><%= comment.body %> </li>
          <% if (currentUserAuthor || currentUserAdmin){ %>
              <form action="<%= toCommentPath+answer.id %>/comments/<%=comment.id%>/delete" method="post">
                <input type="hidden" name="_method" value="delete" />
                <div>
                  <input type="submit" name="delete" value="Borrar comentario" />
                </div>
              </form>
              <form action="<%= toCommentPath+answer.id %>/comments/<%=comment.id%>/edit" method="get">
                <div>
              <input type="submit" name="edit" value="Editar Comentario" />
                </div>
              </form>
            <% } %>
          <% }) %>
        </ul>
      <% }}) %>
    </ul> 
    <form action="<%= toCommentPath+answer.id %>/comments/new" method="get">
      <div>
        <input type="submit" name="new" value="Comentar" />
      </div>
    </form>
  <% }) %>
</ul>


