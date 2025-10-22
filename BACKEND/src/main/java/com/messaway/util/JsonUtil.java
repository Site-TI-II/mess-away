package com.messaway.util;

import com.google.gson.Gson;
import spark.ResponseTransformer;

public class JsonUtil {
    private static final Gson gson = new Gson();

    public static String toJson(Object object) {
        return gson.toJson(object);
    }

    public static ResponseTransformer json() {
        return JsonUtil::toJson;
    }
}
