package com.messaway.util;

import com.google.gson.Gson;
import com.google.gson.JsonElement;
import spark.ResponseTransformer;

public class JsonUtil {
    private static final Gson gson = new Gson();

    public static String toJson(Object object) {
        return gson.toJson(object);
    }

    public static ResponseTransformer json() {
        return JsonUtil::toJson;
    }

    public static JsonElement parse(String json) {
        return gson.fromJson(json, JsonElement.class);
    }
}
