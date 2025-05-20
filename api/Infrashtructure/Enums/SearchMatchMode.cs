namespace api.Infrashtructure.Enums
{
    public enum SearchMatchMode
    {
        Contains,   // như hiện tại: LIKE %token%
        StartsWith, // LIKE token%
        Exact       // = token
    }

}
