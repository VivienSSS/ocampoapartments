import { queryOptions } from "@tanstack/react-query";
import { Collections, type InquiryResponse, type ApartmentUnitsResponse, type PropertiesResponse } from "../types";
import { pb } from "..";


export const listInqueryQuery = (
    page: number,
    perPage: number,
    sort?: string,
) =>
    queryOptions({
        queryKey: [Collections.Inquiry, page, perPage, sort],
        queryFn: () =>
            pb
                .collection<InquiryResponse<{ unitInterested: ApartmentUnitsResponse<{ property: PropertiesResponse }> }>>(Collections.Inquiry)
                .getList(page, perPage, {
                    sort,
                    expand: "unitInterested.property"
                }),
    });